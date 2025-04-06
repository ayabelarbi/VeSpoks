use anchor_lang::prelude::*;

declare_id!("CarbN2rxkvGLJQECuKJ4y931xCGwbmL3Bbmi7W8KFjmT");

// Program for tracking carbon price and consumption rates by region
#[program]
pub mod carbon_oracle {
    use super::*;

    // Initialize the oracle and set the authority
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.authority = ctx.accounts.authority.key();
        oracle.carbon_price_per_ton = 0; // Initialize with zero
        oracle.last_carbon_price_update = Clock::get()?.unix_timestamp;

        msg!("Carbon Oracle initialized with authority: {}", oracle.authority);
        Ok(())
    }

    // Set or update the price of carbon per ton (in EUR cents)
    pub fn update_carbon_price(ctx: Context<UpdateOracleData>, price_eur_cents: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        require!(
            ctx.accounts.authority.key() == oracle.authority,
            ErrorCode::Unauthorized
        );

        oracle.carbon_price_per_ton = price_eur_cents;
        oracle.last_carbon_price_update = Clock::get()?.unix_timestamp;

        msg!("Updated carbon price to: {} EUR cents per ton", price_eur_cents);
        Ok(())
    }

    // Add or update region data
    pub fn update_region_data(
        ctx: Context<UpdateOracleData>,
        region_code: String,
        avg_vehicle_consumption_per_km: u32,
        avg_electric_consumption_per_km: u32,
        avg_hybrid_consumption_per_km: u32,
        region_emission_factor: u32,
    ) -> Result<()> {
        require!(region_code.len() <= 10, ErrorCode::RegionCodeTooLong);
        require!(
            ctx.accounts.authority.key() == ctx.accounts.oracle.authority,
            ErrorCode::Unauthorized
        );

        let oracle = &mut ctx.accounts.oracle;
        
        // Look for existing region to update
        let mut region_found = false;
        for region in &mut oracle.regions {
            if region.code == region_code {
                region.avg_vehicle_consumption_per_km = avg_vehicle_consumption_per_km;
                region.avg_electric_consumption_per_km = avg_electric_consumption_per_km;
                region.avg_hybrid_consumption_per_km = avg_hybrid_consumption_per_km;
                region.emission_factor = region_emission_factor;
                region.last_update = Clock::get()?.unix_timestamp;
                region_found = true;
                break;
            }
        }

        // If region not found, add new region if space allows
        if !region_found {
            require!(
                oracle.regions.len() < 20, // Maximum of 20 regions
                ErrorCode::MaxRegionsExceeded
            );

            oracle.regions.push(RegionData {
                code: region_code.clone(),
                avg_vehicle_consumption_per_km,
                avg_electric_consumption_per_km,
                avg_hybrid_consumption_per_km,
                emission_factor: region_emission_factor,
                last_update: Clock::get()?.unix_timestamp,
            });
        }

        msg!("Updated data for region: {}", region_code);
        Ok(())
    }

    // Calculate carbon emissions and cost for a specific trip
    pub fn calculate_trip_carbon(
        ctx: Context<CalculateTrip>,
        region_code: String,
        vehicle_type: VehicleType,
        distance_km: u32,
    ) -> Result<TripCalculation> {
        let oracle = &ctx.accounts.oracle;
        
        // Find region data
        let region = oracle.regions.iter()
            .find(|r| r.code == region_code)
            .ok_or(ErrorCode::RegionNotFound)?;
        
        // Get consumption based on vehicle type
        let consumption_per_km = match vehicle_type {
            VehicleType::Standard => region.avg_vehicle_consumption_per_km,
            VehicleType::Electric => region.avg_electric_consumption_per_km,
            VehicleType::Hybrid => region.avg_hybrid_consumption_per_km,
        };
        
        // Calculate carbon emissions in grams
        // Consumption is in ml/km or Wh/km, emission factor is in g CO2 per unit consumed
        let carbon_emissions = (consumption_per_km as u64) * (region.emission_factor as u64) * (distance_km as u64) / 1000;
        
        // Calculate carbon cost in microcents (1/1,000,000 of a dollar)
        // Carbon price is in cents per ton, emissions in grams
        // 1 ton = 1,000,000 grams
        let carbon_cost = (carbon_emissions * oracle.carbon_price_per_ton) / 1_000_000;
        
        let calculation = TripCalculation {
            region: region_code.clone(),
            vehicle_type,
            distance_km,
            carbon_emissions_grams: carbon_emissions,
            carbon_cost_microcents: carbon_cost,
            timestamp: Clock::get()?.unix_timestamp,
        };
        
        msg!("Trip calculation: {} km in {} region with {} vehicle", 
            distance_km, 
            region_code,
            match vehicle_type {
                VehicleType::Standard => "standard",
                VehicleType::Electric => "electric",
                VehicleType::Hybrid => "hybrid",
            }
        );
        msg!("Carbon emissions: {} grams, Cost: {} microcents", 
            carbon_emissions, 
            carbon_cost
        );
        
        Ok(calculation)
    }
}

// Context for initializing the oracle
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + // discriminator
                32 + // authority pubkey
                8 +  // carbon price
                8 +  // last carbon price update
                4 + (10 + 4 + 4 + 4 + 4 + 8) * 20, // regions vec with 20 max entries
    )]
    pub oracle: Account<'info, CarbonOracle>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Context for updating oracle data
#[derive(Accounts)]
pub struct UpdateOracleData<'info> {
    #[account(mut)]
    pub oracle: Account<'info, CarbonOracle>,
    
    pub authority: Signer<'info>,
}

// Context for calculating a trip's carbon
#[derive(Accounts)]
pub struct CalculateTrip<'info> {
    pub oracle: Account<'info, CarbonOracle>,
}

// Main oracle account that stores carbon price and region data
#[account]
pub struct CarbonOracle {
    pub authority: Pubkey,
    pub carbon_price_per_ton: u64,         // Price in EUR cents
    pub last_carbon_price_update: i64,     // Unix timestamp
    pub regions: Vec<RegionData>,          // Data by region
}

// Data structure for regional carbon and consumption info
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct RegionData {
    pub code: String,                            // Region identifier (max 10 chars)
    pub avg_vehicle_consumption_per_km: u32,     // In ml fuel per km for standard vehicles
    pub avg_electric_consumption_per_km: u32,    // In Wh per km for electric vehicles
    pub avg_hybrid_consumption_per_km: u32,      // In ml fuel per km for hybrid vehicles
    pub emission_factor: u32,                    // Carbon emission factor (g CO2 per unit consumed)
    pub last_update: i64,                        // Unix timestamp
}

// Vehicle types for carbon calculations
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq)]
pub enum VehicleType {
    Standard,
    Electric,
    Hybrid,
}

// Result of carbon emission calculation
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TripCalculation {
    pub region: String,
    pub vehicle_type: VehicleType,
    pub distance_km: u32,
    pub carbon_emissions_grams: u64,
    pub carbon_cost_microcents: u64,      // In millionths of a dollar
    pub timestamp: i64,
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Region code too long (max 10 characters)")]
    RegionCodeTooLong,
    #[msg("Maximum number of regions (20) exceeded")]
    MaxRegionsExceeded,
    #[msg("Region not found")]
    RegionNotFound,
}
