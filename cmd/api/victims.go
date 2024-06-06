package main

import (
	"net/http"

	"github.com/Caps1d/babyn-yar/internal/data"
	"github.com/Caps1d/babyn-yar/internal/validator"
)

func (app *application) listVictimsHandler(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Fullname string
		Info     string
		data.Filters
	}

	v := validator.New()

	qs := r.URL.Query()

	input.Fullname = app.readString(qs, "fullname", "")
	input.Info = app.readString(qs, "info", "")

	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "pagesize", 100, v)

	input.Filters.Sort = app.readString(qs, "sort", "-fullname")
	input.Filters.SortSafelist = []string{"fullname", "-fullname"}

	if data.ValidateFilters(v, input.Filters); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	victims, metadata, err := app.models.Victims.GetAll(input.Fullname, input.Info, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, envelope{"victims": victims, "metadata": metadata}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
