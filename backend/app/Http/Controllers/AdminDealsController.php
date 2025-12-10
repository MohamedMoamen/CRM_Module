<?php

namespace App\Http\Controllers;

use App\Models\Deal;
use Illuminate\Http\Request;

class AdminDealsController extends Controller
{
    // Get all deals
    public function index()
    {
        $deals = Deal::with('customer')->get();
        return response()->json($deals);
    }

    // Show specific deal
    public function show($id)
    {
        $deal = Deal::with('customer')->findOrFail($id);
        return response()->json($deal);
    }

    // Create deal
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'amount' => 'required|numeric',
            'stage' => 'nullable|in:new,negotiation,won,lost',
            'expected_close_date' => 'nullable|date',
        ]);

        $deal = Deal::create($request->only(['customer_id','amount','stage','expected_close_date']));

        return response()->json($deal, 201);
    }

    // Update deal (all fields)
    public function update(Request $request, $id)
    {
        $deal = Deal::findOrFail($id);

        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'amount' => 'nullable|numeric',
            'stage' => 'nullable|in:new,negotiation,won,lost',
            'expected_close_date' => 'nullable|date',
        ]);

        $deal->update($request->only(['customer_id','amount','stage','expected_close_date']));

        return response()->json($deal);
    }

    // Delete deal
    public function destroy($id)
    {
        $deal = Deal::findOrFail($id);
        $deal->delete();

        return response()->json(['message' => 'Deal deleted successfully']);
    }
}