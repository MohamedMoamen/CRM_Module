<?php

namespace App\Http\Controllers;

use App\Models\Log;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{  //For Both Sales And Support 
    private function getUserByRole($id, $role)
    {
    return User::where('role', $role)->findOrFail($id);
    }
    
    private function handleStore($data, $role)
    {
    $data['role'] = $role;
    return User::create($data);
    }
    
    //Sales 
        //Get All Sales Users
   public function sales()
   {
    $users = User::where('role', 'sales')->get();
    return response()->json($users);
   }
        //Store New Sales User
   public function storeSales(Request $request)
    {
    $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6',
        'phone' => 'required|numeric|unique:users,phone'
    ]);

    $user = $this->handleStore($request->all(), 'sales');

    Log::create([
    'user_id'     => $request->user()->id,
    'user_role'   => $request->user()->role,
    'action_type' => 'create',
    'table_name'  => 'users',
    'record_id'   => $user->id,
    'old_data'    => null,
    'new_data'    => json_encode($user->toArray()),
    ]);


    return response()->json(['message'=>'Sales created','user'=>$user]);
    }

        //Update Sales User
    public function updateSales(Request $request, $id)
    {
      $user = $this->getUserByRole($id, 'sales');

      $request->validate([
          'name' => 'sometimes|string|max:255',
          'email' => 'sometimes|email|unique:users,email,' . $user->id,
          'password' => 'sometimes|string|min:6',
          'phone' => 'sometimes|numeric|unique:users,phone,' . $user->id,
      ]);

      $data = $request->only(['name', 'email', 'phone', 'password']);

        if ($request->filled('password')) {
            $data['password'] =$request->password;
        } else {
            unset($data['password']); 
        }
        
        $oldData=$user->toArray();

        $user->update($data);

        Log::create([
          'user_id'     => $request->user()->id,
          'user_role'   => $request->user()->role,
          'action_type' => 'update',
          'table_name'  => 'users',
          'record_id'   => $user->id,
          'old_data'    => json_encode($oldData),
          'new_data'    => json_encode($user->fresh()->toArray()),
        ]);
    
        return response()->json([
            'message' => 'Sales updated successfully',
            'user' => $user
        ]);
    }
       
       //Delete Sales User
    public function destroySales(Request $request, $id)
    {
      $user = $this->getUserByRole($id, 'sales');

      $oldData = $user->toArray();

     Log::create([
       'user_id'     => $request->user()->id,
       'user_role'   => $request->user()->role,
       'action_type' => 'delete',
       'table_name'  => 'users',
       'record_id'   => $user->id,
       'old_data'    => json_encode($oldData),
       'new_data'    => null,
     ]);


      $user->delete();

      return response()->json([
          'message' => 'Sales deleted successfully'
      ]);
    }

    //Support

       //Get All Support Users
   public function support()
   {
    $users = User::where('role', 'support')->get();
    return response()->json($users);
   }
       
      //Store New Support User
   public function storeSupport(Request $request)
    {
       $request->validate([
           'name' => 'required',
           'email' => 'required|email|unique:users,email',
           'password' => 'required|min:6',
           'phone' => 'required|numeric|unique:users,phone'
       ]);

       $user = $this->handleStore($request->all(), 'support');

       Log::create([
         'user_id'     => $request->user()->id,
         'user_role'   => $request->user()->role,
         'action_type' => 'create',
         'table_name'  => 'users',
         'record_id'   => $user->id,
         'old_data'    => null,
         'new_data'    => json_encode($user->toArray()),
        ]);

       return response()->json(['message'=>'Support created','user'=>$user]);
    }

      //Update Support User
    public function updateSupport(Request $request, $id)
    {
       $user = $this->getUserByRole($id, 'support');

       $request->validate([
           'name' => 'sometimes|string|max:255',
           'email' => 'sometimes|email|unique:users,email,' . $user->id,
           'password' => 'sometimes|string|min:6',
           'phone' => 'sometimes|numeric|unique:users,phone,' . $user->id,
       ]);

       $oldData=$user->toArray();

        $data = $request->only(['name', 'email', 'phone', 'password']);

        if ($request->filled('password')) {
            $data['password'] =$request->password;
        } else {
            unset($data['password']); 
        }

        $user->update($data);
        Log::create([
          'user_id'     => $request->user()->id,
          'user_role'   => $request->user()->role,
          'action_type' => 'update',
          'table_name'  => 'users',
          'record_id'   => $user->id,
          'old_data'    => json_encode($oldData),
          'new_data'    => json_encode($user->fresh()->toArray()),
        ]);
    
        return response()->json([
            'message' => 'Sales updated successfully',
            'user' => $user
        ]);
    }

      //Delete Support User
    public function destroySupport(Request $request,$id)
    {
      $user = $this->getUserByRole($id, 'support');

      $oldData = $user->toArray();

      Log::create([
          'user_id'     => $request->user()->id,
          'user_role'   => $request->user()->role,
          'action_type' => 'delete',
          'table_name'  => 'users',
          'record_id'   => $user->id,
          'old_data'    => json_encode($oldData),
          'new_data'    => null,
      ]);

      $user->delete();

      return response()->json([
          'message' => 'Support deleted successfully'
      ]);
    }


}
