use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use std::collections::hash_map::DefaultHasher;
use std::hash::Hasher;

declare_id!("7o67cgqG8dZRBEw8zqb8m6aG2FHRpQShTTskGGs59FrU");

// A simple Bloom Filter with a fixed size
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BloomFilter {
    // Using an array of 64 bytes (512 bits) for our filter
    bits: [u8; 64],
    // Number of hash functions
    num_hashes: u8,
}

impl Default for BloomFilter {
    fn default() -> Self {
        Self {
            bits: [0; 64],
            num_hashes: 3,
        }
    }
}

impl BloomFilter {
    pub fn new(num_hashes: u8) -> Self {
        Self {
            bits: [0; 64],
            num_hashes,
        }
    }

    // Check if an item might be in the set
    pub fn might_contain(&self, item: &[u8]) -> bool {
        for i in 0..self.num_hashes {
            let bit_index = self.hash(item, i);
            let byte_index = bit_index / 8;
            let bit_offset = bit_index % 8;
            let bit_mask = 1u8 << bit_offset;
            
            if (self.bits[byte_index] & bit_mask) == 0 {
                return false;
            }
        }
        true
    }

    // Add an item to the set
    pub fn add(&mut self, item: &[u8]) {
        for i in 0..self.num_hashes {
            let bit_index = self.hash(item, i);
            let byte_index = bit_index / 8;
            let bit_offset = bit_index % 8;
            let bit_mask = 1u8 << bit_offset;
            
            self.bits[byte_index] |= bit_mask;
        }
    }

    // Hash function using a seed
    fn hash(&self, item: &[u8], seed: u8) -> usize {
        let mut hasher = DefaultHasher::new();
        hasher.write(item);
        hasher.write_u8(seed);
        let hash = hasher.finish();
        
        (hash as usize) % (self.bits.len() * 8)
    }
}

#[program]
pub mod cycleback {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        scooter_reward_rate: u64,
        bike_reward_rate: u64,
        electric_bike_reward_rate: u64,
    ) -> Result<()> {
        let state_account = &mut ctx.accounts.state_account;
        state_account.owner = ctx.accounts.owner.key();
        state_account.scooter_reward_rate = scooter_reward_rate;
        state_account.bike_reward_rate = bike_reward_rate;
        state_account.electric_bike_reward_rate = electric_bike_reward_rate;
        
        // Initialize the bloom filter with 3 hash functions
        state_account.processed_tx_filter = BloomFilter::new(3);
        
        msg!(
            "Program initialized with scooter_rate: {}, bike_rate: {}, electric_rate: {}",
            scooter_reward_rate,
            bike_reward_rate,
            electric_bike_reward_rate
        );
        Ok(())
    }

    pub fn update_value_scooter_reward_rate(
        ctx: Context<UpdateValue>,
        new_value: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );

        let state_account = &mut ctx.accounts.state_account;
        state_account.scooter_reward_rate = new_value;
        msg!("Scooter reward rate updated to: {}", new_value);
        Ok(())
    }

    pub fn update_value_bike_reward_rate(ctx: Context<UpdateValue>, new_value: u64) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );

        let state_account = &mut ctx.accounts.state_account;
        state_account.bike_reward_rate = new_value;
        msg!("Bike reward rate updated to: {}", new_value);
        Ok(())
    }

    pub fn update_value_electric_bike_reward_rate(
        ctx: Context<UpdateValue>,
        new_value: u64,
    ) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );

        let state_account = &mut ctx.accounts.state_account;
        state_account.electric_bike_reward_rate = new_value;
        msg!("Electric reward rate updated to: {}", new_value);
        Ok(())
    }

    pub fn mint_tokens(
        ctx: Context<MintTokens>, 
        vehicle_type: String, 
        meters: u64,
        transaction_id: [u8; 32]
    ) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );
        
        // Check if this transaction ID has been processed before
        let state_account = &mut ctx.accounts.state_account;
        if state_account.processed_tx_filter.might_contain(&transaction_id) {
            return Err(ErrorCode::DuplicateTransactionId.into());
        }
        
        // Store the reward rate based on vehicle type to avoid borrowing issues
        let amount_to_mint = match vehicle_type.as_str() {
            "scooter" => state_account.scooter_reward_rate * meters,
            "bike" => state_account.bike_reward_rate * meters,
            "electric" => state_account.electric_bike_reward_rate * meters,
            _ => return Err(ErrorCode::InvalidVehicleType.into()),
        };

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::mint_to(cpi_ctx, amount_to_mint)?;

        // Add this transaction ID to the bloom filter
        state_account.processed_tx_filter.add(&transaction_id);

        msg!(
            "Minted {} tokens for {}m traveled by {} with transaction ID {:?}",
            amount_to_mint,
            meters,
            vehicle_type,
            transaction_id
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 8 + 8 + 8 + 64 + 1, // discriminator + pubkey + 3 u64 values + bloom filter (64 bytes) + num_hashes
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
#[derive(Default)]
pub struct ProgramState {
    pub owner: Pubkey,
    // The reward rates are the amount of tokens per meter traveled
    pub scooter_reward_rate: u64,
    pub bike_reward_rate: u64,
    pub electric_bike_reward_rate: u64,
    // Bloom filter to track processed transaction IDs
    pub processed_tx_filter: BloomFilter,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access. Only the owner can perform this action.")]
    Unauthorized,
    #[msg("Invalid vehicle type. Supported types are 'scooter', 'bike', and 'electric'.")]
    InvalidVehicleType,
    #[msg("This transaction ID has already been processed.")]
    DuplicateTransactionId,
}
