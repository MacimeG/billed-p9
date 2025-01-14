/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
// import { bills } from "../fixtures/bills.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
});

// Init onNavigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({
    pathname,
  });
};


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i can put some information", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const newBills = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      const formNewBill = screen.getByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy()
    })
    test("Then i upload a File", ()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      // je recupere les information de la page
      const newBills = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      // je simule le click, et j'appel la fonction correspondante
      const handleChangeFile = jest.fn((e)=> newBills.handleChangeFile(e))
      const buttonFile = screen.getByTestId("file")
      buttonFile.addEventListener("click", handleChangeFile)
      userEvent.click(buttonFile)
      // je verifie si la fonction est bien appeler
      expect(handleChangeFile).toHaveBeenCalled();

    })
   
  })
})

// test d'intégration POST new bill

describe("Given I am connected as an employee", ()=>{
  describe("When i submit the form completed", ()=>{
    test("Then bill is create", ()=>{
      const html = NewBillUI()
      document.body.innerHTML = html
      // ici j'appel les données mocker via le store
      const newBills = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      newBills.updateBill = jest.fn()
      const handleSubmit = jest.fn((e)=> newBills.handleSubmit(e))

      const form = screen.getByTestId('form-new-bill')
      form.addEventListener('submit', handleSubmit)
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
      expect(newBills.updateBill).toHaveBeenCalled()
    })
  })
})
