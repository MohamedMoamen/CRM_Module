<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
   public function index(Request $request)
   {
     $logs = Log::with('user')
               ->orderBy('created_at', 'desc')
               ->get();

     $logs = $logs->map(function($log) {
        return [
            'id'          => $log->id,
            'user_id'     => $log->user_id,
            'user_name'   => $log->user ? $log->user->name : null,
            'user_role'   => $log->user_role,
            'action_type' => $log->action_type,
            'table_name'  => $log->table_name,
            // 'record_id'   => $log->record_id,
            // 'old_data'    => $log->old_data,
            // 'new_data'    => $log->new_data,
            'created_at'  => $log->created_at,
        ];
     });

    return response()->json($logs);
    }

    public function show(Request $request, $id)
    {   
     $log = Log::with('user')->findOrFail($id);

     return response()->json([
        'id'          => $log->id,
        'user_id'     => $log->user_id,
        'user_name'   => $log->user ? $log->user->name : null,
        'user_role'   => $log->user_role,
        'action_type' => $log->action_type,
        'table_name'  => $log->table_name,
        'record_id'   => $log->record_id,
        'old_data'    => $log->old_data,
        'new_data'    => $log->new_data,
        'created_at'  => $log->created_at,
     ]);
    }
}
