use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};

declare_id!("7o67cgqG8dZRBEw8zqb8m6aG2FHRpQShTTskGGs59FrU");

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

    pub fn mint_tokens(ctx: Context<MintTokens>, vehicle_type: String, meters: u64) -> Result<()> {
        require!(
            ctx.accounts.owner.key() == ctx.accounts.state_account.owner,
            ErrorCode::Unauthorized
        );

        let amount_to_mint = match vehicle_type.as_str() {
            "scooter" => ctx.accounts.state_account.scooter_reward_rate * meters,
            "bike" => ctx.accounts.state_account.bike_reward_rate * meters,
            "electric" => ctx.accounts.state_account.electric_bike_reward_rate * meters,
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

        msg!(
            "Minted {} tokens for {}m traveled by {}",
            amount_to_mint,
            meters,
            vehicle_type
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 8 + 8 + 8, // discriminator + pubkey + 3 u64 values
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
    // The reward rates are the amount of tokens per meter traveled
    pub scooter_reward_rate: u64,
    pub bike_reward_rate: u64,
    pub electric_bike_reward_rate: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access. Only the owner can perform this action.")]
    Unauthorized,
    #[msg("Invalid vehicle type. Supported types are 'scooter', 'bike', and 'electric'.")]
    InvalidVehicleType,
}
