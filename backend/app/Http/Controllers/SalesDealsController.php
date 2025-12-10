<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Deal;
use Illuminate\Http\Request;

class SalesDealsController extends Controller
{
    // Get deals assigned to this sales user
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $deals = Deal::whereHas('customer', function($q) use ($userId) {
            $q->where('assigned_to', $userId);
        })->with('customer')->get();

        return response()->json($deals);
    }

    // Show specific deal if assigned to this sales user
    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;

        $deal = Deal::where('id', $id)
            ->whereHas('customer', fn($q) => $q->where('assigned_to', $userId))
            ->with('customer')
            ->firstOrFail();

        return response()->json($deal);
    }

    // Create deal only for customers assigned to this sales user
    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'amount' => 'required|numeric',
            'stage' => 'nullable|in:new,negotiation,won,lost',
            'expected_close_date' => 'nullable|date',
        ]);

        $customer = Customer::findOrFail($request->customer_id);

        if ($customer->assigned_to != $userId) {
            return response()->json(['message' => 'Unauthorized to create deal for this customer'], 403);
        }

        $deal = Deal::create($request->only(['customer_id','amount','stage','expected_close_date']));

        return response()->json($deal, 201);
    }

    // Update only stage of deal assigned to this sales user
    public function update(Request $request, $id)
    {
        $userId = $request->user()->id;

        $deal = Deal::where('id', $id)
            ->whereHas('customer', fn($q) => $q->where('assigned_to', $userId))
            ->firstOrFail();

        $request->validate([
            'stage' => 'required|in:new,negotiation,won,lost',
        ]);

        $deal->update(['stage' => $request->stage]);

        return response()->json($deal);
    }
}
