type Callbacks = {
  onSuccess?: () => void;
  onFailure?: (err: Error) => void;
};

export type Msg =
  | [
      "itinerary/create",
      {
        itinerary: any | any[];
        callbacks?: Callbacks;
      }
    ]
  | [
      "itinerary/update",
      {
        itinerary: any;
        callbacks?: Callbacks;
      }
    ]
  | [
      "itinerary/delete",
      {
        itineraryid: string;
        callbacks?: Callbacks;
      }
    ];
