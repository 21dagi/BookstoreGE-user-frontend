import { describe, it, expect } from 'vitest';
import { mockCatalogService } from '@/mocks/services/mockCatalogService';
import { mockWalletService } from '@/mocks/services/mockWalletService';
import { mockEqubService } from '@/mocks/services/mockEqubService';
import { useCartStore } from '@/features/cart/store/cartStore';

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

  it('deducts wallet balance and creates transaction on purchase', async () => {
    const initialBalance = await mockWalletService.getBalance();
    const deductAmount = 300;
    const result = await mockWalletService.deductBalance(deductAmount, {
      titleAm: 'የመጽሐፍ ግዢ',
      titleEn: 'Book Purchase',
      reference: '#ORD-TEST-001',
    });

    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(initialBalance.totalBalance - deductAmount);
    expect(result.transaction.amount).toBe(deductAmount);
    expect(result.transaction.sign).toBe('debit');

    const txs = await mockWalletService.getTransactions('purchase');
    expect(txs.some((tx) => tx.reference === '#ORD-TEST-001')).toBe(true);
  });

  it('supports cart operations (add, quantity, remove, clear)', async () => {
    const books = await mockCatalogService.getBooks();
    const testBook = books[0]!;

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);

    useCartStore.getState().addItem(testBook, 2);
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().getItemCount()).toBe(2);
    expect(useCartStore.getState().getTotalPrice()).toBe(testBook.price * 2);

    useCartStore.getState().updateQuantity(testBook.id, 5);
    expect(useCartStore.getState().getItemCount()).toBe(5);

    useCartStore.getState().removeItem(testBook.id);
    expect(useCartStore.getState().items.length).toBe(0);
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });
});
