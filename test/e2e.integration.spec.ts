import axios from "axios";

// <codeFragment name="e2e">
describe("the restaurants endpoint", () => {
  it("ranks by the recommendation heuristic", async () => {
    const response = await axios.get<ResponsePayload>( // ref-axios
      "http://localhost:3000/vancouverbc/restaurants/recommended",
      { timeout: 1000 },
    );
    expect(response.status).toEqual(200);
    const data = response.data;
    const returnRestaurants = data.restaurants.map(r => r.id);
    expect(returnRestaurants).toEqual(["cafegloucesterid", "burgerkingid"]); // ref-check-id
  });
});

type ResponsePayload = {
  restaurants: { id: string; name: string }[];
};
// </codeFragment>
