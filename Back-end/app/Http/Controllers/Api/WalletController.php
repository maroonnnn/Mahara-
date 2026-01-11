<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * عرض رصيد المحفظة وسجل العمليات للمستخدم الحالي.
     */
    public function show(Request $request)
    {
        $wallet = $request->user()->wallet()->with(['transactions' => function ($query) {
            $query->latest();
        }])->firstOrFail();

        return response()->json($wallet);
    }

    /**
     * إيداع رصيد (للاختبار أو لإيداع العميل). تزيد الرصيد فوراً.
     */
    public function deposit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'reference_type' => 'nullable|string|max:191',
            'reference_id' => 'nullable|integer',
            'description' => 'nullable|string|max:500',
            'method' => 'nullable|string|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $request->user();
        $wallet = $user->wallet;

        $transaction = DB::transaction(function () use ($wallet, $request) {
            $wallet->increment('balance', $request->amount);

            return Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'deposit',
                'amount' => $request->amount,
                'status' => 'completed',
                'reference_type' => $request->reference_type,
                'reference_id' => $request->reference_id,
                'details' => [
                    'note' => $request->description || 'Manual deposit',
                    'method' => $request->method || 'unknown',
                ],
            ]);
        });

        return response()->json(['message' => 'Deposit completed', 'transaction' => $transaction]);
    }

    /**
     * طلب سحب أرباح المستقل. يتم الخصم مباشرة وتسجيل العملية.
     */
    public function withdraw(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'description' => 'nullable|string|max:500',
            'method' => 'nullable|string|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $request->user();
        $wallet = $user->wallet;

        if ($wallet->balance < $request->amount) {
            return response()->json(['message' => 'Insufficient balance'], 422);
        }

        $transaction = DB::transaction(function () use ($wallet, $request) {
            $wallet->decrement('balance', $request->amount);

            $details = [
                'note' => $request->description || 'Withdrawal request',
                'method' => $request->method || 'unknown',
            ];

            // Add bank details if provided
            if ($request->has('bank_details') && $request->bank_details) {
                $details['bank_details'] = $request->bank_details;
            }

            return Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'withdraw',
                'amount' => $request->amount,
                'status' => 'pending', // يمكن للمدير تغييرها لاحقاً إلى completed
                'details' => $details,
            ]);
        });

        return response()->json(['message' => 'Withdrawal request submitted', 'transaction' => $transaction]);
    }

    /**
     * عرض سجل المعاملات للمستخدم الحالي.
     */
    public function transactions(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json(['data' => []]);
        }

        $transactions = Transaction::where('wallet_id', $wallet->id)
            ->latest('created_at')
            ->paginate(20);

        return response()->json($transactions);
    }
}

