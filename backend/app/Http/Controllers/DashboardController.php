<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
 
    public function admindashboard(Request $request)
    {
        $salesUsersCount = User::where('role', 'sales')->count();

        $supportUsersCount = User::where('role', 'support')->count();

        $leadsCount = Lead::count();

        $customersCount = Customer::count();

        $dealsCount = Deal::count();

        $ticketsCount = Ticket::count();

        return response()->json([
            'sales_users' => $salesUsersCount,
            'support_users' => $supportUsersCount,
            'leads' => $leadsCount,
            'customers' => $customersCount,
            'deals' => $dealsCount,
            'tickets' => $ticketsCount
        ]);
    }

    public function salesDashboard(Request $request)
    {
    $user = $request->user();

    $leadsCount = Lead::where('assigned_to', $user->id)->count();

    $customersCount = Customer::where('assigned_to', $user->id)->count();

    $customerIds = Customer::where('assigned_to', $user->id)->pluck('id');

    $dealsCount = Deal::whereIn('customer_id', $customerIds)->count();

    $ticketsCount = Ticket::whereIn('customer_id', $customerIds)->count();

    return response()->json([
        'leads' => $leadsCount,
        'customers' => $customersCount,
        'deals' => $dealsCount,
        'tickets' => $ticketsCount
    ]);
    }


    public function supportDashboard(Request $request)
    {
    $user = $request->user();

    $ticketsQuery = Ticket::where('assigned_to', $user->id);

    $openCount = (clone $ticketsQuery)->where('status', 'open')->count();
    $inProgressCount = (clone $ticketsQuery)->where('status', 'in_progress')->count();
    $closedCount = (clone $ticketsQuery)->where('status', 'closed')->count();

    return response()->json([
        'open' => $openCount,
        'in_progress' => $inProgressCount,
        'closed' => $closedCount
    ]);
    }
}
