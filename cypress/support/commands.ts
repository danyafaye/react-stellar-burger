/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
export {};

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  namespace Cypress {
    interface Chainable {
      dragAndDrop(sourceSelector: string, targetSelector: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dragAndDrop', (sourceSelector: string, targetSelector: string) => {
  cy.get(sourceSelector).trigger('dragstart');
  cy.get(targetSelector).trigger('drop');
});
