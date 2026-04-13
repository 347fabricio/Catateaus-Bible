const api = "http://10.0.0.201:3000/api";

export async function getChapter(bookId, chapterId) {
  try {
    const request = await fetch(`${api}/books/${bookId}/chapters/${chapterId}`);

    if (!request.ok) {
      const errorData = await request.json();
      throw new Error(errorData.message);
    }

    const response = await request.json();

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getChapters(bookId) {
  try {
    const request = await fetch(`${api}/books/${bookId}/chapters`);

    if (!request.ok) {
      const errorData = await request.json();
      throw new Error(errorData.message);
    }

    const response = await request.json();

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getVersions() {
  try {
    const request = await fetch(`${api}/versions`);

    if (!request.ok) {
      const errorData = await request.json();
      throw new Error(errorData.message);
    }

    const response = await request.json();

    return response;
  } catch (error) {
    throw error;
  }
}

export async function getBooks() {
  try {
    const request = await fetch(`${api}/books`);

    if (!request.ok) {
      const errorData = await request.json();
      throw new Error(errorData.message);
    }

    const response = await request.json();

    return response;
  } catch (error) {
    throw error;
  }
}

function getBookById() {
  console.log("hi, allan");
}
