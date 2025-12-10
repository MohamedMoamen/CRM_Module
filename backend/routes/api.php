<?php

use App\Http\Controllers\AdminLeadController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LeadController;
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
});

//Sales Routes
Route::middleware(['auth:sanctum', EnsureSales::class])->group(function () {
    //CRUD Leads
    Route::get('/leads', [LeadController::class, 'index']);
    Route::post('/leads', [LeadController::class, 'store']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::put('/leads/{id}', [LeadController::class, 'update']);
    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);

    //Create Customer when convert status of lead into converted
    Route::post('/customer', [CustomerController::class, 'store']);
});


//Admin And Sales Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{id}', [CustomerController::class, 'show']);
    Route::post('/newcustomer', [CustomerController::class, 'new']);
    Route::put('/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);
});