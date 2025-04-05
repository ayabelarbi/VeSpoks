use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};

declare_id!("7o67cgqG8dZRBEw8zqb8m6aG2FHRpQShTTskGGs59FrU");

#[program]
pub mod cycleback {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, cycleback_per_scooter_meters: u64, cycleback_per_bike_meters: u64) -> Result<()> {
        let state_account = &mut ctx.accounts.state_account;
        state_account.owner = ctx.accounts.owner.key();
        state_account.cycleback_per_scooter_meters = cycleback_per_scooter_meters;
        state_account.cycleback_per_bike_meters = cycleback_per_bike_meters;
        msg!("Program initialized with value_a: {} and value_b: {}", cycleback_per_scooter_meters, cycleback_per_bike_meters);
        Ok(())
    }

    pub fn update_value_cycleback_per_scooter_meters(ctx: Context<UpdateValue>, new_value: u64) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );
        
        let state_account = &mut ctx.accounts.state_account;
        state_account.cycleback_per_scooter_meters = new_value;
        msg!("Value A updated to: {}", new_value);
        Ok(())
    }

    pub fn update_value_cycleback_per_bike_meters(ctx: Context<UpdateValue>, new_value: u64) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );
        
        let state_account = &mut ctx.accounts.state_account;
        state_account.cycleback_per_bike_meters = new_value;
        msg!("Value B updated to: {}", new_value);
        Ok(())
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, vehicle_type: String, meters: u64) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );
        
        let amount_to_mint = match vehicle_type.as_str() {
            "scooter" => ctx.accounts.state_account.cycleback_per_scooter_meters * meters,
            "bike" => ctx.accounts.state_account.cycleback_per_bike_meters * meters,
            _ => return Err(ErrorCode::InvalidVehicleType.into())
        };
        
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::mint_to(cpi_ctx, amount_to_mint)?;
        
        msg!("Minted {} tokens for {}m traveled by {}", amount_to_mint, meters, vehicle_type);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 8 + 8, // discriminator + pubkey + 2 u64 values
    )]
    pub state_account: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateValue<'info> {
    #[account(mut)]
    pub state_account: Account<'info, ProgramState>,
    
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub state_account: Account<'info, ProgramState>,
    
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct ProgramState {
    pub owner: Pubkey,
    pub cycleback_per_scooter_meters: u64,
    pub cycleback_per_bike_meters: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access. Only the owner can perform this action.")]
    Unauthorized,
    #[msg("Invalid vehicle type. Supported types are 'scooter' and 'bike'.")]
    InvalidVehicleType,
}

