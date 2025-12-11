<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;


class TicketController extends Controller
{
    // Get Tickets
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Ticket::with(['customer', 'assignedTo'])->orderBy('created_at', 'desc')->get();
        }

        if ($user->role === 'sales') {
            return Ticket::whereIn(
                'customer_id',
                $user->customers()->pluck('id')
            )->with(['customer', 'assignedTo'])->orderBy('created_at', 'desc')->get();
        }

        if ($user->role === 'support') {
            return Ticket::where('assigned_to', $user->id)
                         ->with(['customer', 'assignedTo'])
                         ->orderBy('created_at', 'desc')
                         ->get();
        }

        return response()->json(['error' => 'Not allowed'], 403);
    }


    //Show Specific Ticket
    public function show(Request $request, Ticket $ticket)
    {
    $user = $request->user();

    if ($user->role === 'admin') {
        return $ticket->load(['customer', 'assignedTo']);
    }

    if ($user->role === 'sales') {
        if (! $user->customers->pluck('id')->contains($ticket->customer_id)) {
            return response()->json(['error' => 'Not allowed'], 403);
        }
        return $ticket->load(['customer', 'assignedTo']);
    }

    if ($user->role === 'support') {
        if ($ticket->assigned_to !== $user->id) {
            return response()->json(['error' => 'Not allowed'], 403);
        }
        return $ticket->load(['customer', 'assignedTo']);
    }

    return response()->json(['error' => 'Not allowed'], 403);
    }

    // Create Ticket
    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'subject' => 'required|string',
            'description' => 'nullable|string',
            'priority' => 'in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($user->role === 'admin') {
            return Ticket::create($data);
        }

        if ($user->role === 'sales') {
            if (! $user->customers->pluck('id')->contains($data['customer_id'])) {
                return response()->json(['error' => 'This customer is not yours'], 403);
            }
            $data['assigned_to'] = null;
            return Ticket::create($data);
        }

        if ($user->role === 'support') {
            $data['assigned_to'] = $user->id;
            return Ticket::create($data);
        }

        return response()->json(['error' => 'Not allowed'], 403);
    }

    // Update Ticket
    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'support'])) {
            return response()->json(['error' => 'Not allowed'], 403);
        }

        $data = $request->validate([
            'status' => 'in:open,in_progress,closed',
            'priority' => 'in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        if ($user->role === 'support') {
            unset($data['assigned_to']);
        }

        $ticket->update($data);

        return $ticket->load(['customer', 'assignedTo']);
    }

    // Delete Ticket
    public function destroy(Request $request, Ticket $ticket)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Not allowed'], 403);
        }

        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted']);
    }
}
