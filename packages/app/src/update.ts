import { Auth } from "@calpoly/mustang";
import type { Msg } from "./messages";
import type { Model } from "./model";

type None = [];
type ThenUpdate<M, MM> = [M, ...Array<Promise<MM | None>>];

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [command, payload] = message as any;
  switch (command) {
    case "itinerary/create": {
      const { itinerary } = payload;
      const cb = (payload.callbacks || {}) as {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      };
      return [
        { ...model },
        createItinerary(itinerary, user)
          .then(() => {
            if (cb.onSuccess) cb.onSuccess();
            return [] as None;
          })
          .catch((err) => {
            if (cb.onFailure) cb.onFailure(err);
            return [] as None;
          }),
      ];
    }
    case "itinerary/update": {
      const { itinerary } = payload;
      const cb = (payload.callbacks || {}) as {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      };
      return [
        { ...model },
        updateItinerary(itinerary, user)
          .then(() => {
            if (cb.onSuccess) cb.onSuccess();
            return [] as None;
          })
          .catch((err) => {
            if (cb.onFailure) cb.onFailure(err);
            return [] as None;
          }),
      ];
    }
    case "itinerary/delete": {
      const { itineraryid } = payload;
      const cb = (payload.callbacks || {}) as {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      };
      return [
        { ...model },
        deleteItinerary(itineraryid, user)
          .then(() => {
            if (cb.onSuccess) cb.onSuccess();
            return [] as None;
          })
          .catch((err) => {
            if (cb.onFailure) cb.onFailure(err);
            return [] as None;
          }),
      ];
    }
    default: {
      const unhandled: never = command as never;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

function createItinerary(
  itinerary: any | any[],
  user: Auth.User
): Promise<void> {
  const items = Array.isArray(itinerary) ? itinerary : [itinerary];
  return Promise.all(
    items.map((item) =>
      fetch(`/api/itineraries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user),
        },
        body: JSON.stringify(item),
      }).then((response: Response) => {
        if (response.ok) return;
        throw new Error(`Failed to create itinerary (HTTP ${response.status})`);
      })
    )
  ).then(() => {});
}

function updateItinerary(itinerary: any, user: Auth.User): Promise<void> {
  const id = itinerary.itineraryid || itinerary.id;
  return fetch(`/api/itineraries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(itinerary),
  }).then((response: Response) => {
    if (response.ok) return;
    throw new Error(`Failed to update itinerary (HTTP ${response.status})`);
  });
}

function deleteItinerary(itineraryid: string, user: Auth.User): Promise<void> {
  return fetch(`/api/itineraries/${itineraryid}`, {
    method: "DELETE",
    headers: {
      ...Auth.headers(user),
    },
  }).then((response: Response) => {
    if (response.ok) return;
    throw new Error(`Failed to delete itinerary (HTTP ${response.status})`);
  });
}
