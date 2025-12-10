# TanStack Router: `useParams` vs `useSearch`

## 1. `useParams`

Path params come from the URL structure. Defined using `$param` in route files.

**Example Route:** `/services/:uuid`

**Usage:**

```ts
const { uuid } = useParams({ from: SingleServiceRoute.id });
```

**Characteristics:**

* Comes from URL path
* Strongly typed
* Changes only when the URL path changes
* Best for IDs, slugs, hierarchical routing

---

## 2. `useSearch`

Query parameters come from `?key=value` in the URL.

**Example URL:** `/auth/reset-password?token=XYZ`

**Usage:**

```ts
const search = useSearch({ from: "/_public/auth/reset-password" });
const token = search.token;
```

**Characteristics:**

* Comes from query string
* Optional by nature
* Great for tokens, filters, pagination, UI state
* Updates without navigating between routes

---

## 3. How to Define Search Params Schema

TanStack Router allows validating and typing search params.

**Example:**

```ts
export const ResetPasswordRoute = createFileRoute("/_public/auth/reset-password")({
  validateSearch: (search) => {
    return {
      token: search.token ?? "",
    };
  },
});
```

This ensures `token` is always typed and available.

---

## 4. How to Update Search Params

Use `useNavigate` with `search`.

**Example:**

```ts
const navigate = useNavigate();

navigate({
  search: (prev) => ({
    ...prev,
    page: 2,
  }),
});
```

Or replace entirely:

```ts
navigate({ search: { token: "newToken" } });
```

---

## 5. When to Choose Query Params vs Path Params

### Use **Path Params** when:

* Identifying a resource (`/users/123`)
* Navigating a hierarchy (`/projects/55/tasks/8`)
* Resource identity is required
* Must be present for route to make sense

### Use **Query Params** when:

* Optional data (filters, pagination)
* Non-structural data (tokens, modes)
* Temporary UI state (tab, sort, search)
* Multiple parameters that aren’t part of the route identity

**Examples of Query Params:**

* `/products?page=3&category=books`
* `/search?q=laptop`
* `/auth/reset-password?token=abc123`

**Examples of Path Params:**

* `/posts/901`
* `/invoices/2024/summary`
* `/services/uuid-here`
