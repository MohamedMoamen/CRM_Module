<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class AdminLeadController extends Controller
{
    //Get All Leads
    public function index()
    {
    $leads = Lead::with('assignedTo')->get();

    $leads = $leads->map(function($lead) {
        return [
            'id' => $lead->id,
            'name' => $lead->name,
            'email' => $lead->email,
            'phone' => $lead->phone,
            'source' => $lead->source,
            'status' => $lead->status,
            'assigned_to' => $lead->assigned_to,
            'assigned_to_name' => $lead->assignedTo ? $lead->assignedTo->name : null,
        ];
    });
    return response()->json($leads);
    }

    //Create A New Lead 
    public function store(Request $request)
    {
    $request->validate([
        "name" => "required|string",
        "email" => "nullable|email",
        "phone" => "nullable",
        "source" => "nullable",
        "assigned_to" => "nullable|exists:users,id",
    ]);

    $lead = Lead::create([
        "name" => $request->name,
        "email" => $request->email,
        "phone" => $request->phone,
        "source" => $request->source,
        "status" => "new",
        "assigned_to" => $request->assigned_to,
    ]);

    return $lead->load('assignedTo');
    }


    

    //Update A Lead
    public function update(Request $request, $id)
    {
    $request->validate([
        "name" => "sometimes|string",
        "email" => "sometimes|nullable|email",
        "phone" => "sometimes|nullable",
        "source" => "sometimes|nullable",
        "assigned_to" => "sometimes|nullable|exists:users,id",
    ]);

    $lead = Lead::findOrFail($id);

    $lead->update($request->only(['name','email','phone','source','assigned_to']));


     return response()->json([
        'message' => 'Lead updated successfully',
        'lead' => $lead
    ]);
    }

    //Delete A Lead
    public function destroy($id)
    {
    Lead::findOrFail($id)->delete();

    return response()->json(['message' => 'Lead deleted']);
    }

}
