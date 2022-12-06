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
    // test("then mail icon in vertical layout should be highlighted", async ()=>{
    //   const html = NewBillUI()
    //   document.body.innerHTML = html

    //   // const newBills = new NewBill({
    //   //   document,
    //   //   onNavigate,
    //   //   store: mockStore,
    //   //   localStorage: window.localStorage,
    //   // });

    //   const root = document.createElement("div")
    //   root.setAttribute("id", "root")
    //   document.body.append(root)
    //   router()
    //   // window.onNavigate(ROUTES_PATH.NewBill)

      
    //   await waitFor(() => screen.getAllByTestId('icon-mail'))
    //   const mailIcon = screen.getAllByTestId('icon-mail')
    //   mailIcon.forEach(icon => {
    //     expect(icon.className).toBe("active-icon")
    //     // expect(mailIcon).toBeTruthy()
    //   })
    // })
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
      // const handleChangeFile = jest.fn(()=> newBills.handleChangeFile())
    })
    test("Then i upload a File", ()=>{
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBills = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      // const regex = /.(jpg|jpeg|png)$/i;
      const handleChangeFile = jest.fn((e)=> newBills.handleChangeFile(e))
      // const filePath = "src/assets/images/facturefreemobile.png"
      const buttonFile = screen.getByTestId("file")
      buttonFile.addEventListener("click", handleChangeFile)
      userEvent.click(buttonFile)
      // expect(buttonFile.value).toMatch(regex);
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

      const newBills = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const validBill = {
        type:"Vol",
        name:"Marseille Lyon",
        date:"2022-12-02",
        amount:"500",
        vat:"70",
        pct:"30",
        commentary:"test",
        fileUrl:"../assets/images/facturefreemobile.png",
        fileName:"facturefreemobile.png",
        status:"pending"
      }

      screen.getByTestId("expense-type").value = validBill.type
      screen.getByTestId("expense-name").value = validBill.name
      screen.getByTestId("datepicker").value = validBill.date
      screen.getByTestId("amount").value = validBill.amount
      screen.getByTestId("vat").value = validBill.vat
      screen.getByTestId("pct").value = validBill.pct
      screen.getByTestId("commentary").value = validBill.commentary

      newBills.fileName = validBill.fileName
      newBills.fileUrl = validBill.fileUrl

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