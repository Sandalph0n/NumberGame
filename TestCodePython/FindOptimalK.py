from DP import max_disjoint_groups_dp

def find_targets_for_teams(N1, N2, X):
    nums1 = list(range(1, N1+1))
    nums2 = list(range(1, N2+1))
    max_sum1 = sum(nums1)
    max_sum2 = sum(nums2)
    results = []

    # Duyệt tất cả các target K1 cho đội 1
    for K1 in range(1, max_sum1+1):
        max_groups1, groups1 = max_disjoint_groups_dp(nums1, K1)
        if max_groups1 == X:
            # Duyệt tất cả các target K2 cho đội 2
            for K2 in range(1, max_sum2+1):
                max_groups2, groups2 = max_disjoint_groups_dp(nums2, K2)
                if max_groups2 == X:
                    results.append({
                        'K1': K1,
                        'K2': K2,
                        'groups1': groups1,
                        'groups2': groups2
                    })
    return results

# Ví dụ:
N1 = 10
N2 = 7
X = 4
results = find_targets_for_teams(N1, N2, X)
for res in results:
    print(f"Đội 1: K={res['K1']}, nhóm: {res['groups1']}")
    print(f"Đội 2: K={res['K2']}, nhóm: {res['groups2']}")
    print("-----")