import { Component, inject ,OnInit,signal} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppConstants } from '../../core/constants/app';
import { Router } from '@angular/router';
import { Utils } from '../../core/utils/utils';

@Component({
  standalone: true,
  selector: 'app-981',
  imports: [CommonModule],
  templateUrl: './981.html',
  styleUrl: './981.css',
})
export class Process981 implements OnInit {

  private appConstants = inject(AppConstants);
  private router = inject(Router);
  private utils = inject(Utils);

  statusOptions = this.appConstants.dashboardStatusOptions;
  priorityOptions = this.appConstants.dashboardPriorityOptions;

  dropdownType: string = '';
  userProjDetails = signal<any>([]);
  selectedStatus = new Set<string>();
  selectedPriority = new Set<string>();


  ngOnInit() {
    this.initialize();
  }

  async initialize(){
    const accDetails = await this.utils.getDetailByKey('wmLgDtls');
    this.userProjDetails.set(accDetails?.processes);
  }

  handleFtrDropdown(val: string) {
    this.dropdownType = this.dropdownType === val ? '' : val;
  }

  isStatusChecked(option: string): boolean {
    return this.selectedStatus.has(option);
  }

  isPriorityChecked(option: string): boolean {
    return this.selectedPriority.has(option);
  }

  toggleStatus(option: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedStatus.add(option);
    } else {
      this.selectedStatus.delete(option);
    }
  }

  togglePriority(option: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedPriority.add(option);
    } else {
      this.selectedPriority.delete(option);
    }
  }

  get quickFilters(): Array<{ type: 'status' | 'priority'; label: string }> {
    const statusFilters = [...this.selectedStatus].map((label) => ({
      type: 'status' as const,
      label,
    }));

    const priorityFilters = [...this.selectedPriority].map((label) => ({
      type: 'priority' as const,
      label,
    }));

    return [...statusFilters, ...priorityFilters];
  }

  removeQuickFilter(filter: { type: 'status' | 'priority'; label: string }) {
    if (filter.type === 'status') {
      this.selectedStatus.delete(filter.label);
      return;
    }
    this.selectedPriority.delete(filter.label);
  }

  openShipmentBookingForm(){
     this.router.navigate(['process', 981, 'add']);    
  }
}
