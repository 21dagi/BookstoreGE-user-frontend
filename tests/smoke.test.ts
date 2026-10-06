import { describe, it, expect } from 'vitest';
import { mockCatalogService } from '@/mocks/services/mockCatalogService';
import { mockWalletService } from '@/mocks/services/mockWalletService';
import { mockEqubService } from '@/mocks/services/mockEqubService';

describe('Customer Frontend Smoke Tests', () => {
  it('loads mock catalog books and categories successfully', async () => {
    const books = await mockCatalogService.getBooks();
    expect(books).toBeDefined();
    expect(books.length).toBeGreaterThan(0);

    const categories = await mockCatalogService.getCategories();
    expect(categories).toBeDefined();
    expect(categories.length).toBeGreaterThan(0);
  });

  it('loads mock wallet balance and accounts successfully', async () => {
    const balance = await mockWalletService.getBalance();
    expect(balance.totalBalance).toBeGreaterThan(0);
    expect(balance.currency).toBe('ETB');

    const accounts = await mockWalletService.getPaymentAccounts();
    expect(accounts.length).toBeGreaterThan(0);
  });

  it('loads mock equb data and supports contributions', async () => {
    const myEqub = await mockEqubService.getMyEqub();
    expect(myEqub).toBeDefined();
    expect(myEqub?.creditVoucherAmount).toBe(6000);
    expect(myEqub?.currentRound).toBe(5);

    const openEqubs = await mockEqubService.getOpenEqubs();
    expect(openEqubs.length).toBe(3);

    const payResult = await mockEqubService.payContribution('equb-st-george', 5, 500);
    expect(payResult.success).toBe(true);

    const joinResult = await mockEqubService.joinEqub('open-1');
    expect(joinResult.success).toBe(true);
  });
});
