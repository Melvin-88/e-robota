import * as types from './actionsTypes_cv';

export function fetchMyCVs() {
    return {
        type: types.FETCH_MY_CVS,
        payload: {
            request: {
                url: 'api/owner_cvs/',
                method: 'get'
            }
        }
    };
}

export function fetchCV(id) {
    return {
        type: types.FETCH_CV,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/`,
                method: 'get'
            }
        }
    };
}

export function updateCVPhoto(id, data) {
    return {
        type: types.UPDATE_CV_PHOTO,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_photo/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function updateCVTitleBox(id, data) {
    return {
        type: types.UPDATE_CV_TITLEBOX,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_info_title/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function updateCVActivity(id, data) {
    return {
        type: types.UPDATE_CV_ACTIVITY,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_publish/`,
                method: 'post',
                data: data
            }
        }
    };
}

export function fetchPositions(query='') {
    return {
        type: types.FETCH_POSITIONS,
        payload: {
            request: {
                url: `api/positions/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchExperienceSpecialty(){
    return {
        type: types.FETCH_EXPERIENCE_SPECIALTY,
        payload: {
            request: {
                url: `api/experience_specialty_options/`,
                method: 'get',
            }
        }
    };
}

export function fetchSkills(query) {
    return {
        type: types.FETCH_SKILLS,
        payload: {
            request: {
                url: `api/skill_options/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchCities(query='') {
    return {
        type: types.FETCH_CITIES,
        payload: {
            request: {
                url: `api/city_options/?name=${query}`,
                method: 'get',
            }
        }
    };
}

export function fetchEmploymentTypes(){
    return {
        type: types.FETCH_EMPLOYMENT_TYPES,
        payload: {
            request: {
                url: `api/employment_type_options/`,
                method: 'get',
            }
        }
    };
}

export function updateCVSummaryBox(id, data) {
    return {
        type: types.UPDATE_SUMMARYBOX,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_info_summary/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVLanguages(id, data) {
    return {
        type: types.UPDATE_CV_LANGUAGES,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_cv_language_skills/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVExperience(id, data) {
    return {
        type: types.UPDATE_CV_EXPERIENCE,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_cv_jobs/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVEducation(id, data) {
    return {
        type: types.UPDATE_CV_EDUCATION,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_cv_institutions/`,
                method: 'post',
                data
            }
        }
    };
}

export function updateCVCourses(id, data) {
    return {
        type: types.UPDATE_CV_EDUCATION,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/set_cv_courses/`,
                method: 'post',
                data
            }
        }
    };
}

export function createCV() {
    return {
        type: types.CREATE_CV,
        payload: {
            request: {
                url: `api/owner_cvs/new_create/`,
                method: 'post',
            }
        }
    };
}

export function deleteCV(id) {
    return {
        type: types.DELETE_CV,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/`,
                method: 'delete',
            }
        }
    };
}

export function copyCV(id) {
    return {
        type: types.COPY_CV,
        payload: {
            request: {
                url: `api/owner_cvs/${id}/copy/`,
                method: 'post',
            }
        }
    };
}