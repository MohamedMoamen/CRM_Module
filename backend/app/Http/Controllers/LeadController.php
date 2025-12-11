<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Log;
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

    $lead = Lead::create([
         "name" => $request->name,
         "email" => $request->email,
         "phone" => $request->phone,
         "source" => $request->source,
         "status" => "new",
         "assigned_to" => $request->user()->id,
     ]);

     Log::create([
         'user_id'     => $request->user()->id,
         'user_role'   => $request->user()->role,
         'action_type' => 'create',
         'table_name'  => 'leads',
         'record_id'   => $lead->id,
         'old_data'    => null,
         'new_data'    => json_encode($lead->toArray()),
     ]);

     return $lead;

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
         $request->validate([
            "name" => "sometimes|string",
            "email" => "nullable|email",
            "phone" => "nullable",
            "source" => "nullable|string",
            "status" => "nullable|string",
        ]);
    $lead = Lead::findOrFail($id);

    $oldData = $lead->toArray();

    if ($lead->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    $oldStatus = $lead->status;

    $lead->update($request->all());
    if ($request->status === "converted" && $oldStatus !== "converted") {
            Customer::create([
                "name" => $lead->name,
                "email" => $lead->email,
                "phone" => $lead->phone,
                "company" => null,
                "address" => null,
                "status" => "new",
                "assigned_to" => $lead->assigned_to,
                "lead_id" => $lead->id
            ]);
        }

        Log::create([
          'user_id'     => $request->user()->id,
          'user_role'   => $request->user()->role,
          'action_type' => 'update',
          'table_name'  => 'leads',
          'record_id'   => $lead->id,
          'old_data'    => json_encode($oldData),
          'new_data'    => json_encode($lead->fresh()->toArray()),
         ]);
 

        return response()->json($lead);
    }

    //Delete A Lead which assigned to this Sales User
    public function destroy(Request $request, $id)
    {
    $lead = Lead::findOrFail($id);

    $oldData = $lead->toArray();


    if ($lead->assigned_to !== $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    Log::create([
    'user_id'     => $request->user()->id,
    'user_role'   => $request->user()->role,
    'action_type' => 'delete',
    'table_name'  => 'leads',
    'record_id'   => $lead->id,
    'old_data'    => json_encode($oldData),
    'new_data'    => null,
    ]);

    $lead->delete();

    
    return response()->json(['message' => 'Lead deleted']);
    }

}
