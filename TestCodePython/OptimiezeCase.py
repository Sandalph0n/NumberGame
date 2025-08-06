def find_subsets_iterative(nums, target):
    n = len(nums)
    result = []
    for mask in range(1, 1 << n):
        subset = []
        total = 0
        for i in range(n):
            if (mask >> i) & 1:
                subset.append(nums[i])
                total += nums[i]
        if total == target:
            result.append(subset)
    return result

def max_disjoint_groups_bruteforce(subsets, N):
    M = len(subsets)
    best = []
    for mask in range(1, 1 << M):
        used = [False] * (N+1)
        valid = True
        current = []
        for i in range(M):
            if (mask >> i) & 1:
                for num in subsets[i]:
                    if used[num]:
                        valid = False
                        break
                if not valid:
                    break
                for num in subsets[i]:
                    used[num] = True
                current.append(subsets[i])
        if valid and len(current) > len(best):
            best = current
    return best

# Ví dụ:
if __name__ == "__main__":
    N = 11
    K = 11
    nums = list(range(1, N+1))
    subsets = find_subsets_iterative(nums, K)
    groups = max_disjoint_groups_bruteforce(subsets, N)
    print("Số nhóm tối đa:", len(groups))
    print("Chi tiết các nhóm:", groups)