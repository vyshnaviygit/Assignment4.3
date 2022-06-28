import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from '../shared/employee.model';
import { EmployeeService } from '../shared/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position', 'salary', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  showData: boolean = false;
  sortedData: any;
  searchTerm!: '';

  constructor(public employeeService: EmployeeService, private _liveAnnouncer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.resetForm();
    this.employeeService.getEmployeeList().subscribe(res => {
      this.showData = true;
      this.dataSource = new MatTableDataSource(Object.assign(res));
    });
    this.refreshEmployeeList();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.employeeService.selectedEmployee = {
      _id: "",
      name: "",
      position: "",
      office: "",
      salary: null,
    }
  }
  customSort(sort: Sort, event: any, newTable: any) {
    const data = event;
    this.sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'position':
          return compare(a.position, b.position, isAsc);
        case 'salary':
          return compare(a.salary, b.salary, isAsc);
        default: return 0;
      }
    });
    if (newTable['_data']) {
      newTable.renderRows();
    }
    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(form: NgForm) {
    if (form.value._id == null || form.value._id == "") {
      this.employeeService.postEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.employeeService.putEmployee(form.value).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshEmployeeList() {
    this.employeeService.getEmployeeList().subscribe((res) => {
      this.dataSource = new MatTableDataSource(Object.assign(res));
    });
  }

  onEdit(emp: Employee) {
    this.employeeService.selectedEmployee = emp;
  }

  onDelete(_id: string, form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.employeeService.deleteEmployee(_id).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}
