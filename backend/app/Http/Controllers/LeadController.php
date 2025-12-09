<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    //Get All Leads which assigned to this Sales User
    public function index(Request $request)
    {
    return Lead::where('assigned_to', $request->user()->id)->get();
    }

    //Create A New Lead assigned to this Sales User
    public function store(Request $request)
    {
    $request->validate([
        "name" => "required|string",
        "email" => "nullable|email",
        "phone" => "nullable",
        "source" => "nullable",
    ]);

    return Lead::create([
        "name" => $request->name,
        "email" => $request->email,
        "phone" => $request->phone,
        "source" => $request->source,
        "status" => "new",
        "assigned_to" => $request->user()->id,
    ]);
    }

    //Get A Specific Lead which assigned to this Sales User
    public function show(Request $request, $id)
    {
    $lead = Lead::findOrFail($id);

    if ($lead->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    return $lead;
    }

    //Update A Lead which assigned to this Sales User
    public function update(Request $request, $id)
    {
    $lead = Lead::findOrFail($id);

    if ($lead->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $lead->update($request->all());

    return $lead;
    }

    //Delete A Lead which assigned to this Sales User
    public function destroy(Request $request, $id)
    {
    $lead = Lead::findOrFail($id);

    if ($lead->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $lead->delete();

    return response()->json(['message' => 'Lead deleted']);
    }

}
