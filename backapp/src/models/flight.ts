export class Flight {

    public price!: string;
    public departureDate: string;
    public returnDate: string;
    public airLine: string;



    constructor(price: string, departureDate: string, returnDate: string, airLine: string
  ) {

        this.price = price;
        this.departureDate = departureDate;
        this.returnDate = returnDate;
        this.airLine = airLine;

    }
}