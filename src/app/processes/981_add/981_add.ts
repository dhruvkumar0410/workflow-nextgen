import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Shared } from '../../services/shared/shared';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-981_add',
  imports: [FormsModule,CommonModule],
  templateUrl: './981_add.html',
  styleUrl: './981_add.css',
})
export class Process981Add implements OnInit {

  private router = inject(Router);
  private shared = inject(Shared);
  private http = inject(HttpClient)
  
  maxStep = 5;
  minStep = 1;
  currentStep = 1;

  /* 1 */
  accountType: 'retail' | 'corporate'  = 'retail';
  customerList =  signal<any>([]);
  selectedCustomerId: string = '';
  referenceNumber: number | null = null;    
  customerSearch: string = '';
  selectedCustomer: any = null;

  /* 2 */
  selectedsenderAddress: any = null;
  selectedsenderBranch: string = '';
  selectedreceiverAddress: any = null;
  selectedreceiverBranch: string = '';
  
  /* 3 */
  consignmentType: 'Forward' | 'Reverse' | null = null;
  consignmentDetails: any[] = [
    this.createConsignment()
  ];
  createConsignment() {
    return {
      type: null,
      category: null,
      weight: null,
      length: '',
      width: '',
      height: '',
      packaging: null,
      declaredValue: '',
      description: ''
    };
  }
  
  /* 4 */
  pickupSenderType: 'doorstep' | 'hub' | null = null;
  receiverType:any;
  insuranceEnabled = signal(false);

  selectedDeliveryDate: string = '';
  deliveryDateEnabled = signal(false);
  deliveryTimestamp: number | null = null;
  
  /* static Data And Payload */
  accountdetails =  signal<any>([]);
  payloadData: any = {}

  ngOnInit(): void {
    this.http.get<any>('assets/AccountDetails.json').subscribe(res => {
      this.accountdetails.set(res);
      console.log(this.accountdetails());
    });
  }

  /* to get corporate ID */
  async onSearchChange(value: string) {
    if (value.length < 4) {
      this.customerList.set([]); 
      return;
    }
    try {
      const response: any = await this.shared.get_customer_details(value);
      if (response?.body) {
        this.customerList.set(response.body)
      }
    } catch (error) {
      console.error('Failed to fetch customer details', error);
    }
  }

  selectCustomer(item: any) {
    this.selectedCustomer = item;
    this.selectedCustomerId = item.user_name;
    this.customerSearch = item.name;
    this.customerList.set([]); 
  }

  onAccountTypeChange(type: 'retail' | 'corporate') {
    this.accountType = type;
    this.referenceNumber = null;
    this.selectedCustomerId = '';
    this.customerSearch = ''
  }

  onAddressSelect() {
    if (this.selectedsenderAddress) {
    this.selectedsenderBranch = this.selectedsenderAddress.branch;
    }
  }

  addnew() {
    this.consignmentDetails.push(this.createConsignment());
  }

  removePiece(index: number) {
    this.consignmentDetails.splice(index, 1);
  }

  onreceiverAddressChange() {
    if (this.selectedreceiverAddress) {
        this.selectedreceiverBranch = this.selectedreceiverAddress.branch;
    }
  }



  onConsignmentType(type: 'Forward' | 'Reverse'){
    this.consignmentType = type;
  }

  get customers() {
    if (!this.accountdetails || !this.accountType) return [];
    return this.accountType === 'retail' ? this.accountdetails().retail_customers || [] : this.accountdetails().corporate_customers || [];
  }

  closeCustomerList() {
    this.customerList.set([]);
  }

  onToggleChange(isChecked: boolean) {
    this.deliveryDateEnabled.set(isChecked);
    if (!isChecked) {
      this.selectedDeliveryDate = '';
      this.deliveryTimestamp = null;
    }
  }

  convertToTimestamp() {
    if (!this.deliveryDateEnabled()) return; 
    if (this.selectedDeliveryDate) {
      const date = new Date(this.selectedDeliveryDate + 'T00:00:00');
      this.deliveryTimestamp = Math.floor(date.getTime() / 1000); 
    } else {
      this.deliveryTimestamp = null;
    }
  }

  buildDataObject(): boolean {
  switch (this.currentStep) {
    case 1:
      if(!this.accountType || !this.selectedCustomerId){
        Swal.fire({ icon: 'warning', text: 'Check Account Type & Customer Id' });
        return false;
      }
      this.payloadData = {
        ...this.payloadData,
        accountType : this.accountType,
        customer_id: this.selectedCustomerId,
        ...(this.referenceNumber !== null ? { reference_number: Number(this.referenceNumber) }: {})
      };
      break;
    case 2:
      if (!this.selectedsenderAddress || !this.selectedsenderBranch ||
          !this.selectedreceiverAddress || !this.selectedreceiverBranch) {
        Swal.fire({ icon: 'warning', text: 'Select Sender & Receiver Details' });
        return false;
      }
      this.payloadData = {
        ...this.payloadData,
        sender_details: {
          address: this.selectedsenderAddress.address,
          branch: this.selectedsenderBranch
        },
        receiver_details: {
          address: this.selectedreceiverAddress.address,
          branch: this.selectedreceiverBranch
        }
      };
      break;
    case 3:
      if (!this.consignmentDetails?.length) {
        Swal.fire({ icon: 'warning', text: 'Add at least one consignment' });
        return false;
      }

      const invalid = this.consignmentDetails.some(item =>!item.type || !item.weight ||!item.category || !item.declaredValue);

      if (invalid) {
        Swal.fire({ icon: 'warning', text: 'Fill all mandatory consignment fields' });
        return false;
      }
      this.payloadData = {
        ...this.payloadData,
        consignmentData: this.consignmentDetails.map(item => ({
          type: item.type,               
          category: item.category,
          weight: item.weight,
          length: Number(item.length),
          width: Number(item.width),
          height: Number(item.height),
          packaging: item.packaging,
          declaredValue: Number(item.declaredValue),
          description: item.description
        }))
    };
    break;
    case 4 :
        this.payloadData = {
          ...this.payloadData,
          sender_services: {
            location_type: this.pickupSenderType,
          },
          receiver_services: {
            location_type: this.receiverType,
            ...(this.deliveryDateEnabled() && this.deliveryTimestamp !== null && {
              delivery_timeStamp: this.deliveryTimestamp
            }),
            insuranceEnabled : this.insuranceEnabled()
          }
        };
    break;
  }

  console.log('Payload after step', this.currentStep, this.payloadData);
  return true;
  }

  handleBack() {
    if (this.currentStep === this.minStep) {
      this.router.navigate(['process', 981 ]);  
    } else {
      if (this.currentStep > this.minStep) {
        this.currentStep--;
      }
    }
  }

  next() {
  if (this.currentStep >= this.maxStep) return;
    const isValid = this.buildDataObject();
    if (!isValid) return;
    this.currentStep++;  
  }
}
