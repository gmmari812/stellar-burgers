import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
      url: '**/api/**'
    });

    await page.goto('/');
  });

  test('отображает ингредиенты из HAR', async ({ page }) => {
    await expect(
      page.getByText('Краторная булка N-200i').first()
    ).toBeVisible();

    await expect(
      page
        .getByText('Биокотлета из марсианской Магнолии')
        .first()
    ).toBeVisible();
  });

  test('добавляет ингредиент в конструктор', async ({ page }) => {
    const bunName = page
      .getByText('Краторная булка N-200i')
      .first();

    await expect(bunName).toBeVisible();

    const bunCard = bunName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await bunCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page.getByText('Краторная булка N-200i').last()
    ).toBeVisible();

    const fillingName = page
      .getByText('Биокотлета из марсианской Магнолии')
      .first();

    await expect(fillingName).toBeVisible();

    const fillingCard = fillingName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await fillingCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page
        .getByText('Биокотлета из марсианской Магнолии')
        .last()
    ).toBeVisible();
  });

  test('открывает и закрывает модальное окно ингредиента', async ({
    page
  }) => {
    const ingredientLink = page.getByRole('link', {
      name: /Краторная булка N-200i/
    });

    await expect(ingredientLink).toBeVisible();

    await ingredientLink.click();

    await expect(page).toHaveURL(/\/ingredients\/bun-1/);

    const modal = page
      .getByRole('heading', {
        name: 'Описание ингредиента'
      })
      .locator('..')
      .locator('..');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByText('Краторная булка N-200i')
    ).toBeVisible();

    await modal.getByRole('button').click();

    await expect(
      page.getByRole('heading', {
        name: 'Описание ингредиента'
      })
    ).not.toBeVisible();
  });

  test('закрывает модальное окно по клику на оверлей', async ({
    page
  }) => {
    const ingredientLink = page.getByRole('link', {
      name: /Краторная булка N-200i/
    });

    await expect(ingredientLink).toBeVisible();

    await ingredientLink.click();

    await expect(page).toHaveURL(/\/ingredients\/bun-1/);

    const modal = page
      .getByRole('heading', {
        name: 'Описание ингредиента'
      })
      .locator('..')
      .locator('..');

    await expect(modal).toBeVisible();

    await expect(
      modal.getByText('Краторная булка N-200i')
    ).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(
      page.getByRole('heading', {
        name: 'Описание ингредиента'
      })
    ).not.toBeVisible();
  });

  test('создаёт заказ и показывает его номер', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        'accessToken',
        'Bearer test-access-token'
      );

      localStorage.setItem(
        'refreshToken',
        'test-refresh-token'
      );

      document.cookie =
        'accessToken=Bearer%20test-access-token; path=/';

      document.cookie =
        'refreshToken=test-refresh-token; path=/';
    });

    await page.reload();

    const bunName = page
      .getByText('Краторная булка N-200i')
      .first();

    await expect(bunName).toBeVisible();

    const bunCard = bunName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await bunCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page.getByText('Краторная булка N-200i').last()
    ).toBeVisible();

    const fillingName = page
      .getByText('Биокотлета из марсианской Магнолии')
      .first();

    await expect(fillingName).toBeVisible();

    const fillingCard = fillingName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await fillingCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page
        .getByText('Биокотлета из марсианской Магнолии')
        .last()
    ).toBeVisible();

    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await expect(orderButton).toBeVisible();

    await orderButton.click();

    const orderNumber = page.getByText('12345');

    await expect(orderNumber).toBeVisible();

    await expect(
      page.getByText('Ваш заказ начали готовить')
    ).toBeVisible();

    await expect(
      page.getByText('Выберите булки').first()
    ).toBeVisible();

    await expect(
      page.getByText('Выберите начинку').first()
    ).toBeVisible();
  });
});