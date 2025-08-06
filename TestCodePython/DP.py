def find_all_valid_submasks(nums, target):
    n = len(nums)
    submask_list = []
    for mask in range(1, 1 << n):
        total = 0
        for i in range(n):
            if (mask >> i) & 1:
                total += nums[i]
        if total == target:
            submask_list.append(mask)
    return submask_list

def max_disjoint_groups_dp(nums, K):
    n = len(nums)
    size = 1 << n
    dp = [0] * size
    prev = [-1] * size  # Để truy vết lại nhóm
    group_mask = [-1] * size  # Lưu nhóm cuối cùng được chọn

    valid_submasks = find_all_valid_submasks(nums, K)

    for mask in range(size):
        for submask in valid_submasks:
            if (mask & submask) == 0:  # Không trùng người
                new_mask = mask | submask
                if dp[new_mask] < dp[mask] + 1:
                    dp[new_mask] = dp[mask] + 1
                    prev[new_mask] = mask
                    group_mask[new_mask] = submask

    # Truy vết lại các nhóm tối ưu
    max_groups = max(dp)
    mask = dp.index(max_groups)
    groups = []
    while mask != 0 and group_mask[mask] != -1:
        group = []
        for i in range(n):
            if (group_mask[mask] >> i) & 1:
                group.append(nums[i])
        groups.append(group)
        mask = prev[mask]
    groups.reverse()
    return max_groups, groups

if __name__ == "__main__":
    # Ví dụ:
    N = 20
    K = 25
    nums = list(range(1, N+1))
    max_groups, groups = max_disjoint_groups_dp(nums, K)
    print("Số nhóm tối đa:", max_groups)
    print("Chi tiết các nhóm:", groups)