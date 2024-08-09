class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const createError = (status: number, message: string): CustomError => {
  return new CustomError(status, message);
};

export default createError;
