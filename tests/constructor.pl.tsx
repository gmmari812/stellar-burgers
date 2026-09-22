import { test, expect } from '@playwright/test';

const mockUser = {
  success: true,
  user: {
    email: 'test@test.ru',
    name: 'Test User'
  }
};

const mockOrder = {
  success: true,
  name: 'Флюоресцентный бургер',
  order: {
    number: 12345
  }
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/constructor.har', {
      notFound: 'fallback'
    });

    await page.goto('/');
  });

  test('отображает ингредиенты из HAR', async ({ page }) => {
    await expect(
      page.getByText('Нет ингредиентов')
    ).not.toBeVisible();
  });

  test('добавляет ингредиент в конструктор', async ({ page }) => {
    const ingredient = page
      .getByText('Краторная булка N-200i')
      .first();

    await expect(ingredient).toBeVisible();

    await ingredient.click();

    await expect(
      page.getByText('Краторная булка N-200i').last()
    ).toBeVisible();
  });

  test('открывает и закрывает модальное окно ингредиента', async ({
    page
  }) => {
    const ingredient = page
      .getByText('Краторная булка N-200i')
      .first();

    await expect(ingredient).toBeVisible();

    await ingredient.click();

    await expect(
      page.getByText('Описание ингредиента')
    ).toBeVisible();

    await expect(
      page.getByText('Краторная булка N-200i').last()
    ).toBeVisible();

    await page.getByRole('button').last().click();

    await expect(
      page.getByText('Описание ингредиента')
    ).not.toBeVisible();
  });

  test('закрывает модальное окно по клику на оверлей', async ({
    page
  }) => {
    const ingredient = page
      .getByText('Краторная булка N-200i')
      .first();

    await expect(ingredient).toBeVisible();

    await ingredient.click();

    await expect(
      page.getByText('Описание ингредиента')
    ).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(
      page.getByText('Описание ингредиента')
    ).not.toBeVisible();
  });

  test('создаёт заказ и показывает его номер', async ({ page }) => {
    // Мокаем данные авторизованного пользователя
    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser)
      });
    });

    // Мокаем создание заказа
    await page.route('**/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockOrder)
        });
      } else {
        await route.continue();
      }
    });

    // Добавляем токены авторизации
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

    // Перезагружаем страницу после установки токенов
    await page.reload();

    /*
     * Находим карточку булки.
     * Клик по названию открывает модальное окно,
     * поэтому для добавления используем кнопку "Добавить".
     */
    const bunName = page.getByText(
      'Краторная булка N-200i'
    ).first();

    await expect(bunName).toBeVisible();

    const bunCard = bunName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await bunCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Проверяем, что булка появилась в конструкторе
    await expect(
      page.getByText('Краторная булка N-200i').last()
    ).toBeVisible();

    /*
     * Находим начинку и добавляем её.
     */
    const fillingName = page.getByText(
      'Биокотлета из марсианской Магнолии'
    ).first();

    await expect(fillingName).toBeVisible();

    const fillingCard = fillingName.locator(
      'xpath=ancestor::*[.//button[normalize-space()="Добавить"]][1]'
    );

    await fillingCard
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Проверяем, что начинка появилась в конструкторе
    await expect(
      page.getByText('Биокотлета из марсианской Магнолии').last()
    ).toBeVisible();

    // Проверяем кнопку оформления заказа
    const orderButton = page.getByRole('button', {
      name: 'Оформить заказ'
    });

    await expect(orderButton).toBeVisible();

    /*
     * Начинаем ждать POST /orders ДО клика,
     * чтобы не пропустить запрос.
     */
    const orderResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/orders') &&
        response.request().method() === 'POST'
    );

    await orderButton.click();

    const response = await orderResponse;

    // Проверяем успешный ответ API
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toEqual(mockOrder);

    // Проверяем номер созданного заказа
    await expect(
      page.getByText('12345')
    ).toBeVisible();

    /*
     * Проверяем, что после создания заказа
     * конструктор очистился.
     */
    await expect(
    page.getByText('Выберите булки').first()
    ).toBeVisible();

    await expect(
    page.getByText('Выберите начинку').first()
    ).toBeVisible();

    /*
     * Закрываем модальное окно заказа.
     */
    await page.getByRole('button').last().click();

    /*
     * Проверяем, что модальное окно закрылось.
     */
    await expect(
      page.getByText('12345')
    ).not.toBeVisible();
  });
});