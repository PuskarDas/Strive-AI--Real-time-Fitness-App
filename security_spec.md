# Security Specification - Strive AI

## Data Invariants
1. **User Ownership**: A user can only read and write their own profile, goals, and workout data.
2. **Immutability**: `userId` in a workout document must match the document path's `userId` and cannot be changed after creation.
3. **Data Integrity**: Workout intensities and categories must be from the allowed set. Calories must be non-negative.
4. **Timestamp Integrity**: `createdAt` and `updatedAt` must be set using server timestamps.

## The Dirty Dozen Payloads (Target: Deny)
1. **Unauthenticated Read**: Attempt to read `/users/user123` without logging in.
2. **Cross-User Write**: User A attempts to write a workout to User B's collection (`/users/userB/workouts/workout1`).
3. **Identity Spoofing**: User A attempts to create a workout in their own collection but sets `userId` to "userB".
4. **Invalid Enum**: Create a workout with `category: 'Zumba'`.
5. **Resource Poisoning**: Create a workout with a `type` string exceeding 500 characters.
6. **Negative Calories**: Create a workout with `calories: -100`.
7. **Bypass Role Check**: If an `isAdmin` flag existed (it doesn't yet), a user tries to set it on themselves.
8. **Orphaned Record**: Create a workout for a user that doesn't have a profile document (if profiles are required).
9. **Update Locked Field**: Attempt to change the `userId` of an existing workout.
10. **Shadow Field injection**: Attempt to update a workout with a field `isVerified: true` that is not in the schema.
11. **PII Leak**: A user attempts to list the `/users` collection to find other users' emails.
12. **Future Timestamp**: A user attempts to set `createdAt` to a year in the future.

## Test Runner (Logic)
The `firestore.rules.test.ts` will verify these payloads return `PERMISSION_DENIED`.
*(Note: Test environment setup is complex in this sandboxed container, I will focus on the rules implementation and linter validation first).*
