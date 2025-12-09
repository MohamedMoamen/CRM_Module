<?php

namespace App\Http\Controllers;

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

        $user->update($data);
    
        return response()->json([
            'message' => 'Sales updated successfully',
            'user' => $user
        ]);
    }
       
       //Delete Sales User
    public function destroySales($id)
    {
      $user = $this->getUserByRole($id, 'sales');
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

        $data = $request->only(['name', 'email', 'phone', 'password']);

        if ($request->filled('password')) {
            $data['password'] =$request->password;
        } else {
            unset($data['password']); 
        }

        $user->update($data);
    
        return response()->json([
            'message' => 'Sales updated successfully',
            'user' => $user
        ]);
    }

      //Delete Support User
    public function destroySupport($id)
    {
      $user = $this->getUserByRole($id, 'support');
      $user->delete();

      return response()->json([
          'message' => 'Support deleted successfully'
      ]);
    }


}
