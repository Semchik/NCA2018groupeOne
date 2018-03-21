import { Component, OnInit } from '@angular/core';
import { OrderService } from "../../service/order.service";
import {JwtHelper} from "angular2-jwt";
import { Router } from "@angular/router";
import {User} from "../../model/user.model";
import {FulfillmentOrder} from "../../model/fulfillmentOrder.model";
import {Order} from "../../model/order.model";

@Component({
  selector: 'app-ccagent',
  templateUrl: './ccagent.component.html',
  styleUrls: ['./ccagent.component.css']
})
export class CcagentComponent implements OnInit {

  fulfillmentOrders: FulfillmentOrder[];
  private JwtHelper: JwtHelper = new JwtHelper();
  ccagent: User = <User>{};
  ccagentId : number;

  sortedField = 'id';
  asc = true;
  statuses = [];
  statusesString = '';
  page : number = 1;
  perPage: number = 15;

  constructor(private orderService: OrderService,
              private router: Router) { }

  ngOnInit() {
    let token = localStorage.getItem("currentUser");
    this.ccagentId = +this.JwtHelper.decodeToken(token).id;
    this.getFulfillments();
  }

  getFulfillments() {
      console.log('getFulfillmentOrders()');
      this.orderService.getFulfillmentOrders(this.ccagentId)
        .subscribe((fulfillmentOrder: FulfillmentOrder[]) => this.fulfillmentOrders = fulfillmentOrder);
  }


  processing(fulfillmentOrder: FulfillmentOrder){

    if(fulfillmentOrder.order.orderStatus == 'OPEN') {
      this.orderService.startProcessing(this.ccagentId, fulfillmentOrder)
        .subscribe((fulfillmentOrder : FulfillmentOrder) => {
          this.router.navigate([`ccagent/orders/${fulfillmentOrder.id}`]);
          // console.log("full order : " + JSON.stringify(order.id));
        });
    }
    else {
      this.router.navigate([`ccagent/orders/${fulfillmentOrder.id}`]);
    }

  }

 reRout(fulfillmentOrder: FulfillmentOrder) {
   if (fulfillmentOrder.order.senderAddress) {
     this.orderService.startProcessing(this.ccagentId, fulfillmentOrder)
       .subscribe((fulfillmentOrder: FulfillmentOrder) => {
         this.router.navigate([`ccagent/orders/ccEdit/${fulfillmentOrder.id}`]);
       });
   }
   else {
     this.orderService.startProcessing(this.ccagentId, fulfillmentOrder)
       .subscribe((fulfillmentOrder: FulfillmentOrder) => {
         this.router.navigate([`ccagent/orders/ocEdit/${fulfillmentOrder.id}`]);
       });
   }
 }

   // if(fulfillmentOrder.order.orderStatus == 'OPEN' || fulfillmentOrder.order.orderStatus == 'PROCESSING') {
   //   this.orderService.startProcessing(this.ccagentId, fulfillmentOrder)
   //     .subscribe((fulfillmentOrder : FulfillmentOrder) => {
   //       this.router.navigate([`ccagent/orders/${fulfillmentOrder.id}`]);
   //     });
   // }
   // else {
   //   this.router.navigate([`ccagent/orders/${fulfillmentOrder.id}`]);
   // }

   // this.orderService.getFulfillmentOrderById(order.id)
   //  // this.orderService.getOrderById(orderId, currentUserId)
   //      .subscribe(() => this.router.navigate(['orderHistory/infoCurrentOrder']));
  // }


  addStatusToFilter(status): string[] {
    this.statuses.push(status);
    this.statusesString = this.statuses.join('.');
    return this.statusesString.split('.');
  }

  deleteStatusFromFilter(status): string[] {
    this.statuses.splice(this.statuses.indexOf(status), 1);
    this.statusesString = this.statuses.join('.');
    return this.statusesString.split('.').filter(status =>{return status.length>1});
  }

}
