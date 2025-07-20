useEffect(() => {
  async function loadProfile() {
    try {
      const data = await apiFetch('/me');
      setProfile(data);
    } catch (err) {
      console.error(err);
      // TODO: toast('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }
  loadProfile();
}, []);
