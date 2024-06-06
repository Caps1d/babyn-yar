package storage

import (
	"io"
)

type Storage interface {
	Upload(file io.ReadSeeker, filename, contentType string) (string, error)
	Exists(key string) (bool, error)
	Delete(keys []string) error
}
