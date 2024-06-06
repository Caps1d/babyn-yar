package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/Caps1d/babyn-yar/internal/data"
	"github.com/Caps1d/babyn-yar/internal/validator"
)

func (app *application) createTestimonyHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Content     string    `json:"content"`
		Cover       string    `json:"cover"`
		Lang        string    `json:"lang"`
		Documents   []string  `json:"documents"`
		OccuredOn   time.Time `json:"occuredOn"`
	}

	err := app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	user := app.contextGetUser(r)

	testimony := &data.VictimTestimony{
		Title:       input.Title,
		Description: input.Description,
		Content:     input.Content,
		Cover:       input.Cover,
		Lang:        input.Lang,
		Documents:   []string{},
		OccuredOn:   input.OccuredOn,
		UserID:      user.ID,
	}

	if len(input.Documents) != 0 {
		testimony.Documents = input.Documents
	}

	v := validator.New()

	if data.ValidateTestimony(v, testimony); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Testimonies.Insert(testimony)

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/victim-testimonies/%d", testimony.ID))

	err = app.writeJson(w, http.StatusCreated, envelope{"testimony": testimony}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) listTestimoniesHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Lang string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Lang = app.readString(qs, "lang", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 10, v)

	input.Filters.Sort = app.readString(qs, "sort", "-created_at")
	input.Filters.SortSafelist = []string{"created_at", "-created_at", "occured_on", "-occured_on"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	testimonies, metadata, err := app.models.Testimonies.GetAll(input.Lang, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"testimonies": testimonies, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) showTestimonyHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	testimony, err := app.models.Testimonies.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"testimony": testimony}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}

func (app *application) updateTestimonyHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	testimony, err := app.models.Testimonies.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Title       *string    `json:"title"`
		Description *string    `json:"description"`
		Content     *string    `json:"content"`
		Lang        *string    `json:"lang"`
		Cover       *string    `json:"cover"`
		Documents   []string   `json:"documents"`
		OccuredOn   *time.Time `json:"occuredOn"`
	}

	err = app.readJson(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Title != nil {
		testimony.Title = *input.Title
	}

	if input.Description != nil {
		testimony.Description = *input.Description
	}

	if input.Content != nil {
		testimony.Content = *input.Content
	}

	if input.Lang != nil {
		testimony.Lang = *input.Lang
	}

	if input.Cover != nil {
		testimony.Cover = *input.Cover
	}

	if input.Documents != nil {
		testimony.Documents = input.Documents
	}

	if input.OccuredOn != nil {
		testimony.OccuredOn = *input.OccuredOn
	}

	v := validator.New()

	if data.ValidateTestimony(v, testimony); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Testimonies.Update(testimony)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			app.editConflictResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"testimony": testimony}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

func (app *application) deleteTestimoniesHandler(w http.ResponseWriter, r *http.Request) {
	v := validator.New()

	qs := r.URL.Query()

	ids := app.readIntList(qs, "ids", v)

	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err := app.models.Testimonies.DeleteMultiple(ids)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"message": "testimonies successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
