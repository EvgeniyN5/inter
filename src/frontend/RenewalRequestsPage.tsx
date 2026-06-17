import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

type RenewalRequest = {
  id: string;
  contractId: string;
  userId: string;
  userEmail: string;
  status: "created" | "paid" | "failed";
  amountCents: number;
  currency: string;
  createdAt: string;
};

async function fetchRenewals(): Promise<RenewalRequest[]> {
  const response = await fetch("/api/admin/renewal-requests");
  const json = await response.json();
  return json.data;
}

async function approveRenewal(id: string) {
  await fetch(`/api/admin/renewal-requests/${id}/approve`, {
    method: "POST",
  });
}

export function RenewalRequestsPage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = useQuery({
    queryKey: ["renewals", search],
    queryFn: fetchRenewals,
    refetchInterval: 1000,
  });

  const approve = useMutation({
    mutationFn: approveRenewal,
    onSuccess: () => {
      window.location.reload();
    },
  });

  useEffect(() => {
    setSelectedIds([]);
  }, [query.data]);

  const filteredRenewals = useMemo(() => {
    return (query.data ?? []).filter((renewal) => {
      return (
        renewal.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        renewal.contractId.includes(search)
      );
    });
  }, [query.data, search]);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.error) {
    return <div>Something went wrong</div>;
  }

  return (
    <main>
      <h1>Renewal requests</h1>

      <input
        value={search}
        placeholder="Search by email or contract"
        onChange={(event) => setSearch(event.target.value)}
      />

      <button
        onClick={() => {
          selectedIds.forEach((id) => approve.mutate(id));
        }}
      >
        Approve selected
      </button>

      <table>
        <thead>
          <tr>
            <th />
            <th>User</th>
            <th>Contract</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {filteredRenewals.map((renewal) => (
            <tr key={renewal.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(renewal.id)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectedIds.push(renewal.id);
                      setSelectedIds(selectedIds);
                    } else {
                      setSelectedIds(
                        selectedIds.filter((id) => id !== renewal.id),
                      );
                    }
                  }}
                />
              </td>
              <td>{renewal.userEmail}</td>
              <td>{renewal.contractId}</td>
              <td>
                {renewal.amountCents / 100} {renewal.currency}
              </td>
              <td>{renewal.status}</td>
              <td>{new Date(renewal.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
