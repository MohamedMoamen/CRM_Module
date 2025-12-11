<?php

use App\Http\Controllers\AdminDealsController;
use App\Http\Controllers\AdminLeadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\SalesDealsController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureSales;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


//Login
Route::post('/login', [AuthController::class, 'login']);

//Logout
Route::middleware(['auth:sanctum'])->post('/logout', [AuthController::class, 'logout']);

//Admin Routes
Route::middleware(['auth:sanctum',EnsureAdmin::class])->group(function() {
    //Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'admindashboard']);
    
    // CRUD Sales
    Route::get('admin/sales', [UserController::class, 'sales']);
    Route::post('admin/sales', [UserController::class, 'storeSales']);
    Route::put('admin/sales/{id}', [UserController::class, 'updateSales']);
    Route::delete('admin/sales/{id}', [UserController::class, 'destroySales']);

    // CRUD Support
    Route::get('admin/support', [UserController::class, 'support']);
    Route::post('admin/support', [UserController::class, 'storeSupport']);
    Route::put('admin/support/{id}', [UserController::class, 'updateSupport']);
    Route::delete('admin/support/{id}', [UserController::class, 'destroySupport']);
    
    //CRUD Leads
    Route::get('/admin/leads', [AdminLeadController::class, 'index']);
    Route::post('/admin/leads', [AdminLeadController::class, 'store']);
    Route::put('/admin/leads/{id}', [AdminLeadController::class, 'update']);
    Route::delete('/admin/leads/{id}', [AdminLeadController::class, 'destroy']);
    // Assign lead to sales user
    Route::post('/admin/leads/{id}/assign', [AdminLeadController::class, 'assignLead']); 
    
    //CRUD Deals
    Route::get('admin/deals', [AdminDealsController::class, 'index']);
    Route::get('admin/deals/{id}', [AdminDealsController::class, 'show']);
    Route::post('admin/deals', [AdminDealsController::class, 'store']);
    Route::put('admin/deals/{id}', [AdminDealsController::class, 'update']);
    Route::delete('admin/deals/{id}', [AdminDealsController::class, 'destroy']);

    //Get Logs
    Route::get('/logs', [LogController::class, 'index']);
    Route::get('/logs/{id}', [LogController::class, 'show']);

});

//Sales Routes
Route::middleware(['auth:sanctum', EnsureSales::class])->group(function () { 
    //Dashboard
    Route::get('/sales/dashboard', [DashboardController::class, 'salesdashboard']);
    
    //CRUD Leads
    Route::get('/leads', [LeadController::class, 'index']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::put('/leads/{id}', [LeadController::class, 'update']);
    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);

    //Create Customer when convert status of lead into converted
    Route::post('/customer', [CustomerController::class, 'store']);

    //CRU Deals
    Route::get('sales/deals', [SalesDealsController::class, 'index']);
    Route::get('sales/deals/{id}', [SalesDealsController::class, 'show']);
    Route::post('sales/deals', [SalesDealsController::class, 'store']);
    Route::put('sales/deals/{id}', [SalesDealsController::class, 'update']); 
});


//Admin , Sales And Support Routes About Customers
Route::middleware('auth:sanctum')->group(function () { 
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    Route::post('/newcustomer', [CustomerController::class, 'new']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);
});


//Admin , Sales And Support Routes About Tickets And Users Data
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
    return $request->user();
    });

    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{ticket}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
    Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);

});

//Support Route For Dashboard

Route::middleware(['auth:sanctum'])->get('/support/dashboard', [DashboardController::class, 'supportdashboard']);
