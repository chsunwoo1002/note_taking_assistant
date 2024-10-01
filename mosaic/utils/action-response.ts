type SuccessResponse<T> = {
  success: true;
  data: T;
  error: null;
};

type ErrorResponse = {
  success: false;
  data: null;
  error: string;
};

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;

export function createActionResponse<T>(
  result: { data: T } | { error: string }
): ActionResponse<T> {
  if ("data" in result) {
    return {
      success: true,
      data: result.data as T,
      error: null,
    };
  } else {
    return {
      success: false,
      data: null,
      error: result.error,
    };
  }
}
