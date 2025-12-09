<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
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
}
