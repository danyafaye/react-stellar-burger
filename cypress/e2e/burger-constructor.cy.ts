/// <reference types="cypress" />

const BURGER_CONSTRUCTOR = '[data-cy=burger-constructor]';
const MODAL = '[data-cy=modal]';
const MODAL_CLOSE_BUTTON = '[data-cy=modal-close-button]';
const ORDER_BUTTON = '[data-cy=order-button]';

describe('burger constructor functionality', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
    cy.intercept('GET', 'api/auth/user', {
      success: true,
      user: { email: 'test@test.com', name: 'Test User' },
    }).as('getUser');

    cy.visit('/');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    cy.setCookie('accessToken', 'mock-access-token');

    cy.wait('@getIngredients');
  });

  it('should drag and drop ingredients and create an order', () => {
    const bunId = '60d3b41abdacab0026a733c6';
    const mainId = '60d3b41abdacab0026a733c9';

    cy.dragAndDrop(`[data-cy=ingredient-${bunId}]`, BURGER_CONSTRUCTOR);

    cy.get(BURGER_CONSTRUCTOR).as('constructor');
    cy.get('@constructor').contains('Краторная булка N-200i (верх)').should('exist');
    cy.get('@constructor').contains('Краторная булка N-200i (низ)').should('exist');

    cy.dragAndDrop(`[data-cy=ingredient-${mainId}]`, BURGER_CONSTRUCTOR);

    cy.get('@constructor')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .should('exist');

    cy.get(`[data-cy=ingredient-${bunId}]`).click();
    cy.get(MODAL).as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').contains('Детали ингредиента').should('exist');
    cy.get('@modal').contains('Краторная булка N-200i').should('exist');

    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    cy.get(ORDER_BUTTON).click();

    cy.wait('@postOrder');
    cy.get(MODAL).as('orderModal');
    cy.get('@orderModal').should('exist');
    cy.get('@orderModal').contains('1234').should('exist');

    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    cy.get('@constructor').contains('Выберите булку').should('exist');
    cy.get('@constructor').contains('Выберите начинку').should('exist');
  });
});
