package main

import (
	"errors"
	"net/http"

	"github.com/Caps1d/babyn-yar/internal/data"
	"github.com/Caps1d/babyn-yar/internal/validator"
)

func (app *application) createAssetsHandler(w http.ResponseWriter, r *http.Request) {
	var maxMemory int64 = 512
	r.ParseMultipartForm(maxMemory)

	files := r.MultipartForm.File["assets"]

	v := validator.New()

	rows := make([][]interface{}, 0, len(files))

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		defer file.Close()

		exists, err := app.storage.Exists(fileHeader.Filename)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		if exists {
			v.AddError(fileHeader.Filename, "already exists")
			continue
		}

		contentType, err := app.detectContentType(file)

		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}

		url, err := app.storage.Upload(file, fileHeader.Filename, contentType)
		if err != nil {
			app.serverErrorResponse(w, r, err)
			return
		}
		row := []interface{}{url, fileHeader.Filename, contentType}
		rows = append(rows, row)
	}

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.Assets.InsertBulk(rows)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusCreated, envelope{"status": "ok"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) listAssetsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Filename    string
		ContentType string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Filename = app.readString(qs, "filename", "")
	input.ContentType = app.readString(qs, "content_type", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "file_name", "-created_at", "-file_name"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	assets, metadata, err := app.models.Assets.GetAll(input.Filename, input.ContentType, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"assets": assets, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteAssetsHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
	}

	filenames, err := app.models.Assets.GetFileNames(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.storage.Delete(filenames)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

	err = app.models.Assets.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "assets successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
