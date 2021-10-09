/// <reference types="cypress" />

import React from "react";
import { mount } from "@cypress/react";
import mock from "../../mock";
import AutocompleteMultiselect from "../../src/lib/components";

describe("multiselect", () => {
  const searchFunction = (query: string) =>
    new Promise<any[]>((resolve) => {
      let filtered = mock;
      if (query.length) {
        filtered = mock.filter((el: any) => {
          console.log(el)
          return el.first_name.indexOf(query) > -1;
        });
      }
      resolve(filtered);
    });

  it("should render the select", () => {
    mount(<AutocompleteMultiselect searchFunction={searchFunction}/>);
    cy.get<HTMLInputElement>("input")
      .type("Wenda")
      .trigger("change");


    cy.get<HTMLLIElement>("li").contains("Wenda");
  });
});
