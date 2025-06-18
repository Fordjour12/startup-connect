async function fetchRecommendations() {
		try {
			const response = await fetch(`${URL_RECOMMENDATIONS}${ApiEndpoint.GET_RECOMMENDATIONS}`, {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch recommendations: ${response.statusText}`,
				);
			}

			const data: RecommendationResponse = await response.json();
			recommendations = data.recommendations;
			startupProfile = data.startup_profile;
			error = null;
		} catch (err) {
			error =
				err instanceof Error
					? err.message
					: "Failed to load recommendations";
			console.error("Error fetching recommendations:", err);
		} finally {
			isLoading = false;
			isRefreshing = false;
		}
	}

	// Fetch algorithm explanation
	async function fetchAlgorithmExplanation() {
		try {
			const response = await fetch(
				`${URL_RECOMMENDATIONS}${ApiEndpoint.GET_RECOMMENDATION_EXPLANATION}`,
				{
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				const data = await response.json();
				algorithmExplanation = data.explanation;
			}
		} catch (err) {
			console.error("Error fetching algorithm explanation:", err);
		}
	}