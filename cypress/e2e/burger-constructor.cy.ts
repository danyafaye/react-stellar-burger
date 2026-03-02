/// <reference types="cypress" />

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

    cy.get(`[data-cy=ingredient-${bunId}]`).trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('[data-cy=burger-constructor]')
      .contains('Краторная булка N-200i (верх)')
      .should('exist');
    cy.get('[data-cy=burger-constructor]')
      .contains('Краторная булка N-200i (низ)')
      .should('exist');

    cy.get(`[data-cy=ingredient-${mainId}]`).trigger('dragstart');
    cy.get('[data-cy=burger-constructor]').trigger('drop');

    cy.get('[data-cy=burger-constructor]')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .should('exist');

    cy.get(`[data-cy=ingredient-${bunId}]`).click();
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal]').contains('Краторная булка N-200i').should('exist');

    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=order-button]').click();

    cy.wait('@postOrder');
    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').contains('1234').should('exist');

    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=burger-constructor]').contains('Выберите булку').should('exist');
    cy.get('[data-cy=burger-constructor]').contains('Выберите начинку').should('exist');
  });
});
