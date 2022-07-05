import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-Listproducts',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListproductsComponent implements OnInit {
    newQuantity;
    newPromotion;
    prixTransaction;
    categories = [
      { "id": 1, "category": 0, "products": null  },
      { "id": 2, "category": 1, "products": null },
      { "id": 3, "category": 2, "products": null },
    ];
    poissons:boolean = true;
    crustaces: boolean=true;
    coquillages: boolean=true;
    visibility = [];
    
  constructor(public productsService: ProductsService) { }

  ngOnInit() {
    this.newQuantity = [];
    this.newPromotion = [];
    this.prixTransaction = [];
  
    this.getProductsAll();
  }
  getProductsAll() {
    for (let i = 0; i < this.categories.length; i++){
      this.getProductsCategory(this.categories[i].category);
    }
  }

  getProductsCategory(cat) {
    this.productsService.getProductCategories(cat).subscribe(res => {
      for (let i = 0; i < this.categories.length; i++)
        if (this.categories[i].category == cat) {
          this.categories[i].products = res;
        }
    },
      (err) => {
        alert('failed loading json data');
      });
  }

  onModifyPromotion() {
    for (let tig_id = 0; tig_id < this.newPromotion.length; tig_id++) {
      if (this.newPromotion[tig_id]) {
        this.productsService.setPromotion(tig_id, this.newPromotion[tig_id]).subscribe(res => {
          res;
        },
          (err) => { 
            alert('failed loading json data');
          });
      }
    }
    console.log(this.newPromotion)
    this.getProductsAll();
  }

  addQuantity() {
    for (let tig_id = 0; tig_id < this.newQuantity.length; tig_id++) {
      if (this.newQuantity[tig_id]) {
        if (this.prixTransaction[tig_id] >= 0){
          this.addTransaction(tig_id, "Purchase");
          this.productsService.addQuantity(tig_id, this.newQuantity[tig_id]).subscribe(res => {
            res;
          },
            (err) => {
              alert(err + 'failed loading json data');
            });
        }
      }
    }
    console.log(this.newQuantity);
    this.getProductsAll();
  }
  removeQuantity() {
    for (let tig_id = 0; tig_id < this.newQuantity.length; tig_id++) {
      if (this.newQuantity[tig_id]) {
        if (this.prixTransaction[tig_id] != undefined) {
          this.productsService.removeQuantity(tig_id, this.newQuantity[tig_id]).subscribe(res => {
            res;
          },
            (err) => {
              alert(err + 'failed loading json data');
            });
          if (this.prixTransaction[tig_id] = 0){
            this.addTransaction(tig_id, "Unsold");}
          else
            this.addTransaction(tig_id, "Sale")
          
        }
      }
    }
    console.log(this.newQuantity);
    this.getProductsAll();
  }
  modifyStock(){
    this.addQuantity();
    this.onModifyPromotion();
    this.getProductsAll();
  }
  addTransaction(tig_id, type){
    if (this.newQuantity[tig_id] && this.prixTransaction[tig_id]) {
      let trans = {
        "price": this.prixTransaction[tig_id],
        "quantity": this.newQuantity[tig_id],
        "tig_id": tig_id,
        "type": type
      }
      this.productsService.postTransaction(trans).subscribe(res => {
        res;
      },
      (err) => {
        alert(err + 'failed loading json data');
      });
    }
  }

}



