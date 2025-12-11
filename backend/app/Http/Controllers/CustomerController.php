<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    //Create Customer When Lead's Status become converted
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'company' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $lead = Lead::findOrFail($validated['lead_id']);

        if ($lead->status !== 'converted') {
            return response()->json(['message' => 'Lead must be converted first'], 400);
        }

        $customer = Customer::create([
            'name'        => $lead->name,
            'email'       => $lead->email,
            'phone'       => $lead->phone,
            'company'     => $validated['company'] ?? null,
            'address'     => $validated['address'] ?? null,
            'status'      => 'new',
            'assigned_to' => $lead->assigned_to,
            'lead_id'     => $lead->id
        ]);

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $customer
        ]);
    }


    //Get Customers
    public function index(Request $request)
    {
       $user = $request->user();
       if ($user->role === 'admin' || $user->role === 'support') {
        // Admin And Support Users see all customers
         $customers = Customer::with('assignedTo')->get();
        } else {
        // Sales user sees only their customers
        $customers = Customer::with('assignedTo')
                               ->where('assigned_to', $user->id)
                               ->get();
        }
        return $customers->map(function ($customer) {
           $customer->assigned_to_name = $customer->assignedTo ? $customer->assignedTo->name : null;
           return $customer;
           });
    }


    //Show Dedicated Customer
     public function show(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        if ($request->user()->role !== 'admin' && $customer->assigned_to !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $customer;
    }

    //Create A New Customer
    public function new(Request $request)
    {
        $request->validate([
            "name" => "required|string",
            "email" => "nullable|email",
            "phone" => "nullable",
            "company" => "nullable|string",
            "address" => "nullable|string",
            "assigned_to" => "nullable|integer" 
        ]);

        $assignedTo = $request->user()->role === 'admin' ? $request->assigned_to : $request->user()->id;

        $customer = Customer::create([
            "name" => $request->name,
            "email" => $request->email,
            "phone" => $request->phone,
            "company" => $request->company,
            "address" => $request->address,
            "assigned_to" => $assignedTo,
        ]);

        return response()->json($customer, 201);
    }

    //Update Customer
    public function update(Request $request, $id)
   {
     if ($request->has('assigned_to')) {
        $request->merge([
            'assigned_to' => $request->assigned_to === "" ? null : (int) $request->assigned_to
        ]);
    }
    $request->validate([
        "name" => "sometimes|string",
        "email" => "nullable|email",
        "phone" => "nullable",
        "company" => "nullable|string",
        "address" => "nullable|string",
        "assigned_to" => "nullable|integer",
        "status" => "nullable|string|in:new,active,vip",
    ]);

    $customer = Customer::findOrFail($id);

    if ($request->user()->role !== 'admin' && $customer->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $data = $request->only(['name', 'email', 'phone', 'company', 'address', 'assigned_to', 'status']);

    $customer->update($data);

    if ($customer->lead_id) {
        $lead = Lead::find($customer->lead_id);
        if ($lead) {
            $lead->update([
                "name" => $customer->name,
                "email" => $customer->email,
                "phone" => $customer->phone,
            ]);
        }
    }

    return response()->json($customer);
   }

    //Delete Customer
    public function destroy(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        if ($request->user()->role !== 'admin' && $customer->assigned_to !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lead = Lead::where('id', $customer->lead_id)->first();
        if ($lead) $lead->delete();

        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }
}

