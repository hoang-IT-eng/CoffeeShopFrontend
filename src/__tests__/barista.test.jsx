import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import BaristaChatWidget from '../components/barista/BaristaChatWidget';
import { analyzeBaristaQuery } from '../components/barista/baristaEngine';

describe('baristaEngine', () => {
  it('calculates scaled V60 brew recipe for 2 cups', () => {
    const res = analyzeBaristaQuery('Công thức V60 2 ly', 'vi');
    expect(res.intent).toBe('recipe');
    const recipe = res.blocks.find((b) => b.type === 'brew_recipe');
    expect(recipe).toBeTruthy();
    expect(recipe.coffeeGrams).toBe('30 g');
    expect(recipe.waterMl).toBe('480 ml');
    expect(recipe.servings).toBe('2 ly');
    const products = res.blocks.find((b) => b.type === 'product_cards');
    expect(products?.items.length).toBeGreaterThan(0);
  });

  it('matches bold low-acidity Phin beans from products catalog', () => {
    const res = analyzeBaristaQuery('Gợi ý hạt pha Phin đậm vị ít chua', 'vi');
    expect(res.intent).toBe('products');
    const cards = res.blocks.find((b) => b.type === 'product_cards');
    expect(cards).toBeTruthy();
    const ids = cards.items.map((i) => i.id);
    expect(ids).toContain('phin-truyen-thong');
  });

  it('returns B2B wholesale card linking to /business-solutions', () => {
    const res = analyzeBaristaQuery('B2B wholesale quote for my cafe', 'en');
    expect(res.intent).toBe('b2b');
    const b2b = res.blocks.find((b) => b.type === 'b2b_card');
    expect(b2b).toBeTruthy();
    expect(b2b.ctaTo).toBe('/business-solutions');
  });
});

describe('BaristaChatWidget', () => {
  beforeEach(() => {
    localStorage.setItem('site-lang', 'vi');
    Element.prototype.scrollIntoView = vi.fn();
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline'));
  });

  it('opens drawer, answers a recipe chip offline, and closes with Escape', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <LanguageProvider>
          <BaristaChatWidget />
        </LanguageProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /AI Barista/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const chip = screen.getByRole('button', { name: 'Công thức V60 2 ly' });
    await user.click(chip);

    await waitFor(() => {
      expect(screen.getByText('30 g')).toBeInTheDocument();
      expect(screen.getByText('480 ml')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
